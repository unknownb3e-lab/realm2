const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationFlags } = require("discord.js");
const {
    addHistory,
    getPrevious
} = require("../utils/musicHistory");

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
        if (!interaction.isButton()) return;

        if (interaction.customId.startsWith("anas_help_")) {
            return;
        }

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
            }

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
