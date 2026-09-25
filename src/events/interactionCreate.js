const { EmbedBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationFlags } = require("discord.js");
const { addHistory, getPrevious } = require("../utils/musicHistory");
const Favorite = require("../models/Favorite");

function formatDuration(ms) {
    if (!ms || ms < 0) return "00:00";

    const totalSeconds = Math.floor(ms / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

module.exports = {
    name: "interactionCreate",

    async execute(client, interaction) {
        if (!interaction.isButton() && !interaction.isModalSubmit()) return;

        if (interaction.customId.startsWith("anas_help_")) {
            return;
        }

        // ==========================================
        // JOIN BUTTONS - NO PLAYER REQUIRED
        // ==========================================

        if (
            interaction.customId.startsWith("join_") ||
            interaction.customId.startsWith("music_more") ||
            interaction.customId === "music_more"
        ) {
            try {
                await handleJoinOrMoreInteraction(client, interaction);
            } catch (error) {
                console.error("❌ Join/more button error:", error);

                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("#2a2a2a")
                                .setDescription(
                                    "❌ صار في خطأ وحنا نستخدم هاذا الزر."
                                )
                        ],
                        flags: [ApplicationFlags.Ephemeral]
                    }).catch(() => {});
                }
            }

            return;
        }

        // ==========================================
        // MUSIC BUTTONS - PLAYER REQUIRED
        // ==========================================

        const player = client.lavalink.getPlayer(interaction.guildId);

        if (!player) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2a2a2a")
                        .setDescription("❌ ماكو مشغل موسيقى شغال حالياً.")
                ],
                flags: [ApplicationFlags.Ephemeral]
            });
        }

        const voiceChannel = interaction.member?.voice?.channel;

        if (!voiceChannel) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2a2a2a")
                        .setDescription(
                            "❌ لازم تكون بروم صوتي حتى تستخدم أزرار التحكم."
                        )
                ],
                flags: [ApplicationFlags.Ephemeral]
            });
        }

        if (
            player.voiceChannelId &&
            player.voiceChannelId !== voiceChannel.id
        ) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2a2a2a")
                        .setDescription(
                            "❌ لازم تكون بنفس الروم الصوتي مع البوت."
                        )
                ],
                flags: [ApplicationFlags.Ephemeral]
            });
        }

        try {
            await handleMusicButtonInteraction(client, interaction, player);
        } catch (error) {
            console.error("❌ Music button error:", error);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#2a2a2a")
                            .setDescription(
                                "❌ صار في خطأ وحنا نستخدم هاذا الزر."
                            )
                    ],
                    flags: [ApplicationFlags.Ephemeral]
                }).catch(() => {});
            }
        }
    }
};

async function handleJoinOrMoreInteraction(client, interaction) {
    switch (interaction.customId) {

        // =========================
        // JOIN - PLAY SONG
        // =========================

        case "join_play": {
            const modal = new ModalBuilder()
                .setCustomId(`join_modal_${interaction.member.id}`)
                .setTitle("تشغيل أغنية");

            const songInput = new TextInputBuilder()
                .setCustomId("song_input")
                .setLabel("اسم الأغنية أو الرابط")
                .setPlaceholder("مثال: Ahmed Bukhatir - Ya Twaijar")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const firstActionRow = new ActionRowBuilder().addComponents(songInput);
            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);

            break;
        }

        // =========================
        // JOIN - FAVORITES
        // =========================

        case "join_favorites": {
            await interaction.deferReply({ flags: [ApplicationFlags.Ephemeral] });

            const userId = interaction.member.id;

            const favorites = await Favorite.find({
                userId: userId,
                guildId: interaction.guildId
            }).sort({ addedAt: -1 });

            if (!favorites.length) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#2a2a2a")
                            .setDescription(
                                "📋 ما عندك أي أغاني في القائمة المفضلة.\n\nأضف أغنية من خلال زر ❤️ أثناء تشغيل الأغنية."
                            )
                    ]
                });
            }

            const tracks = favorites.map((fav, index) => ({
                label: `${index + 1}. ${fav.title}`,
                description: `${fav.author} • ${formatDuration(fav.duration)}`,
                value: `fav_${fav.trackIdentifier}`,
                emoji: "❤️"
            }));

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId(`favorites_select_${userId}`)
                .setPlaceholder("اختر أغنية من المفضلة")
                .addOptions(tracks.slice(0, 25));

            const row = new ActionRowBuilder().addComponents(selectMenu);

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2a2a2a")
                        .setTitle("❤️ القائمة المفضلة")
                        .setDescription(
                            `عندك **${favorites.length}** أغنية في المفضلة\n\nاختر أغنية للتشغيل:`
                        )
                        .setFooter({
                            text: "anas Music"
                        })
                ],
                components: [row]
            });

            break;
        }

        // =========================
        // JOIN/MUSIC MORE
        // =========================

        case "join_more":
        case "music_more": {
            await interaction.deferReply({ flags: [ApplicationFlags.Ephemeral] });

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId(`more_options_${interaction.member.id}`)
                .setPlaceholder("اختر خيار")
                .addOptions(
                    {
                        label: "شرح الأوامر",
                        description: "عرض جميع الأوامر مع الشرح",
                        value: "help_commands",
                        emoji: "📖",
                    },
                    {
                        label: "الإدارة",
                        description: "خيارات الإدارة",
                        value: "admin",
                        emoji: "⚙️",
                    },
                    {
                        label: "المعلومات",
                        description: "معلومات البوت",
                        value: "info",
                        emoji: "ℹ️",
                    },
                    {
                        label: "تشغيل أغنية",
                        description: "تشغيل أغنية جديدة",
                        value: "play_song",
                        emoji: "🎵",
                    },
                    {
                        label: "القائمة المفضلة",
                        description: "عرض القائمة المفضلة",
                        value: "favorites",
                        emoji: "❤️",
                    }
                );

            const row = new ActionRowBuilder().addComponents(selectMenu);

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2a2a2a")
                        .setTitle("📋 خيارات إضافية")
                        .setDescription("اختر من القائمة بالأسفل:")
                        .setFooter({
                            text: "anas Music"
                        })
                ],
                components: [row]
            });

            break;
        }

        // =========================
        // FAVORITES SELECT
        // =========================

        case "favorites_select": {
            await interaction.deferReply({ flags: [ApplicationFlags.Ephemeral] });

            const trackIdentifier = interaction.values[0]?.replace("fav_", "");

            if (!trackIdentifier) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#2a2a2a")
                            .setDescription("❌ حدث خطأ في اختيار الأغنية.")
                    ]
                });
            }

            const favorite = await Favorite.findOne({
                userId: interaction.member.id,
                guildId: interaction.guildId,
                trackIdentifier: trackIdentifier
            });

            if (!favorite) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#2a2a2a")
                            .setDescription("❌ ما لقيت هذي الأغنية في المفضلة.")
                    ]
                });
            }

            const currentPlayer = client.lavalink.getPlayer(interaction.guildId);

            if (!currentPlayer) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#2a2a2a")
                            .setDescription("❌ ماكو مشغل موسيقى شغال حالياً.")
                    ]
                });
            }

            await currentPlayer.play({
                query: favorite.trackIdentifier,
                source: "ytmsearch"
            });

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2a2a2a")
                        .setDescription(
                            `🎵 **${favorite.title}**\n\nتمت الإضافة للقائمة وسيتم تشغيلها.`
                        )
                        .setFooter({
                            text: "anas Music"
                        })
                ]
            });

            break;
        }

        // =========================
        // MORE OPTIONS SELECT
        // =========================

        case "help_commands":
        case "admin":
        case "info":
        case "play_song":
        case "favorites": {
            await interaction.deferReply({ flags: [ApplicationFlags.Ephemeral] });

            let responseEmbed;

            switch (interaction.values[0]) {
                case "help_commands":
                    responseEmbed = new EmbedBuilder()
                        .setColor("#2a2a2a")
                        .setTitle("📖 شرح الأوامر")
                        .setDescription(
                            "**🎵 أوامر الموسيقى**\n" +
                            "`play` - تشغيل أغنية\n" +
                            "`pause` - إيقاف مؤقت\n" +
                            "`resume` - استئناف\n" +
                            "`skip` - تخطي\n" +
                            "`stop` - إيقاف نهائي\n" +
                            "`volume` - تغيير الصوت\n" +
                            "`queue` - عرض القائمة\n" +
                            "`loop` - تكرار\n" +
                            "`247` - وضع 24/7\n\n" +
                            "**ℹ️ معلومات**\n" +
                            "`help` - قائمة المساعدة\n" +
                            "`ping` - سرعة الاستجابة\n" +
                            "`stats` - إحصائيات البوت"
                        );
                    break;

                case "admin":
                    responseEmbed = new EmbedBuilder()
                        .setColor("#2a2a2a")
                        .setTitle("⚙️ الإدارة")
                        .setDescription(
                            "**🛡️ أوامر الإدارة**\n" +
                            "`blacklist add @user` - حظر مستخدم\n" +
                            "`blacklist remove @user` - رفع الحظر\n" +
                            "`blacklist list` - عرض المحظورين\n\n" +
                            "فقط مالك البوت يستطيع استخدام هذه الأوامر."
                        );
                    break;

                case "info":
                    responseEmbed = new EmbedBuilder()
                        .setColor("#2a2a2a")
                        .setTitle("ℹ️ معلومات البوت")
                        .setDescription(
                            "**بوت اغاني احترافي**\n\n" +
                            "**المطور:** anas\n" +
                            `**السيرفرات:** \`${client.guilds.cache.size}\`\n` +
                            `**المستخدمين:** \`${client.guilds.cache.reduce((total, guild) => total + (guild.memberCount || 0), 0).toLocaleString()}\``
                        )
                        .setFooter({
                            text: "anas Music"
                        })
                        .setTimestamp();
                    break;

                case "play_song":
                    const modal = new ModalBuilder()
                        .setCustomId(`join_modal_${interaction.member.id}`)
                        .setTitle("تشغيل أغنية");

                    const songInput = new TextInputBuilder()
                        .setCustomId("song_input")
                        .setLabel("اسم الأغنية أو الرابط")
                        .setPlaceholder("مثال: Ahmed Bukhatir - Ya Twaijar")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true);

                    const firstActionRow = new ActionRowBuilder().addComponents(songInput);
                    modal.addComponents(firstActionRow);

                    await interaction.showModal(modal);
                    return;

                case "favorites":
                    const favorites = await Favorite.find({
                        userId: interaction.member.id,
                        guildId: interaction.guildId
                    }).sort({ addedAt: -1 });

                    if (!favorites.length) {
                        responseEmbed = new EmbedBuilder()
                            .setColor("#2a2a2a")
                            .setDescription(
                                "📋 ما عندك أي أغاني في القائمة المفضلة.\n\nأضف أغنية من خلال زر ❤️ أثناء تشغيل الأغنية."
                            );
                    } else {
                        const favList = favorites.map((fav, index) =>
                            `**${index + 1}.** ${fav.title}\n` +
                            `┕ ${fav.author} • ${formatDuration(fav.duration)}\n`
                        ).join("\n");

                        responseEmbed = new EmbedBuilder()
                            .setColor("#2a2a2a")
                            .setTitle("❤️ القائمة المفضلة")
                            .setDescription(
                                `عندك **${favorites.length}** أغنية في المفضلة\n\n${favList}`
                            )
                            .setFooter({
                                text: "anas Music"
                            });
                    }
                    break;

                default:
                    return;
            }

            await interaction.editReply({
                embeds: [responseEmbed]
            });

            break;
        }
    }
}

async function handleMusicButtonInteraction(client, interaction, player) {
    switch (interaction.customId) {

        // =========================
        // PLAY / PAUSE
        // =========================

        case "music_playpause": {
            if (player.paused) {
                await player.resume();

                const row = interaction.message.components[0];

                const updatedButtons = row.components.map(button => {
                    if (button.customId === "music_playpause") {
                        return {
                            type: 2,
                            style: 2,
                            label: null,
                            emoji: {
                                name: "⏸️"
                            },
                            custom_id: "music_playpause"
                        };
                    }

                    return button;
                });

                await interaction.update({
                    components: [
                        {
                            type: 1,
                            components: updatedButtons
                        }
                    ]
                });

                return;
            }

            await player.pause();

            const row = interaction.message.components[0];

            const updatedButtons = row.components.map(button => {
                if (button.customId === "music_playpause") {
                    return {
                        type: 2,
                        style: 2,
                        label: null,
                        emoji: {
                            name: "▶️"
                        },
                        custom_id: "music_playpause"
                    };
                }

                return button;
            });

            await interaction.update({
                components: [
                    {
                        type: 1,
                        components: updatedButtons
                    }
                ]
            });

            break;
        }

        // =========================
        // STOP
        // =========================

        case "music_stop": {
            await player.stopPlaying();
            await player.disconnect();

            await interaction.update({
                components: []
            });

            break;
        }

        // =========================
        // VOLUME UP
        // =========================

        case "music_volup": {
            const currentVolume = player.volume ?? 75;
            const newVolume = Math.min(100, currentVolume + 10);

            await player.setVolume(newVolume);

            await interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2a2a2a")
                        .setTitle("🔊 تم رفع الصوت")
                        .setDescription(
                            `مستوى الصوت الحالي: **${newVolume}%**`
                        )
                        .setFooter({
                            text: "anas Music"
                        })
                ],
                components: interaction.message.components
            });

            break;
        }

        // =========================
        // VOLUME DOWN
        // =========================

        case "music_voldown": {
            const currentVolume = player.volume ?? 75;
            const newVolume = Math.max(0, currentVolume - 10);

            await player.setVolume(newVolume);

            await interaction.update({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2a2a2a")
                        .setTitle("🔉 تم تخفيض الصوت")
                        .setDescription(
                            `مستوى الصوت الحالي: **${newVolume}%**`
                        )
                        .setFooter({
                            text: "anas Music"
                        })
                ],
                components: interaction.message.components
            });

            break;
        }

        // =========================
        // FAVORITE TOGGLE
        // =========================

        case "music_favorite": {
            const currentTrack = player.queue.current;

            if (!currentTrack) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#2a2a2a")
                            .setDescription("❌ ماكو أغنية شغالة حالياً.")
                    ],
                    flags: [ApplicationFlags.Ephemeral]
                });
            }

            const existing = await Favorite.findOne({
                userId: interaction.member.id,
                guildId: interaction.guildId,
                trackIdentifier: currentTrack.info?.identifier
            });

            if (existing) {
                await Favorite.deleteOne({
                    _id: existing._id
                });

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#2a2a2a")
                            .setDescription("💔 تم إزالة الأغنية من المفضلة.")
                    ],
                    flags: [ApplicationFlags.Ephemeral]
                });
            } else {
                await Favorite.create({
                    userId: interaction.member.id,
                    guildId: interaction.guildId,
                    trackEncoded: currentTrack.info?.encoded || "",
                    trackIdentifier: currentTrack.info?.identifier || "",
                    title: currentTrack.info?.title || "عنوان غير معروف",
                    author: currentTrack.info?.author || "فنان غير معروف",
                    duration: currentTrack.info?.duration || 0,
                    artworkUrl: currentTrack.info?.artworkUrl || currentTrack.info?.thumbnail || null
                });

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#2a2a2a")
                            .setDescription("❤️ تم إضافة الأغنية للمفضلة.")
                    ],
                    flags: [ApplicationFlags.Ephemeral]
                });
            }

            break;
        }
    }
}
