const { EmbedBuilder } = require("discord.js");
const {
    addHistory,
    getPrevious
} = require("../utils/musicHistory");

module.exports = {
    name: "interactionCreate",

    async execute(client, interaction) {
        if (!interaction.isButton()) return;

// Help menu buttons are handled by the help command collector
if (
    interaction.customId.startsWith("yowa_help_")
) {
    return;
}

        const player = client.lavalink.getPlayer(interaction.guildId);

        if (!player) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#808080")
                        .setDescription("❌ ماكو مشغل موسيقى شغال حاليًا.")
                ],
                ephemeral: true
            });
        }

        const voiceChannel = interaction.member?.voice?.channel;

        if (!voiceChannel) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#808080")
                        .setDescription(
                            "❌ لازم تكون بروم صوتي حتى تستخدم أزرار التحكم."
                        )
                ],
                ephemeral: true
            });
        }

        if (
            player.voiceChannelId &&
            player.voiceChannelId !== voiceChannel.id
        ) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#808080")
                        .setDescription(
                            "❌ لازم تكون بنفس الروم الصوتي مع البوت."
                        )
                ],
                ephemeral: true
            });
        }

        try {
            switch (interaction.customId) {

                // =========================
                // PAUSE / RESUME
                // =========================

                case "music_pause": {

                    if (player.paused) {
                        await player.resume();

                        const row = interaction.message.components[0];

                        const updatedButtons = row.components.map(button => {
                            if (button.customId === "music_pause") {
                                return {
                                    type: 2,
                                    style: 2,
                                    label: null,
                                    emoji: {
                                        name: "⏸️"
                                    },
                                    custom_id: "music_pause"
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
                        if (button.customId === "music_pause") {
                            return {
                                type: 2,
                                style: 2,
                                label: null,
                                emoji: {
                                    name: "▶️"
                                },
                                custom_id: "music_pause"
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
                // SKIP
                // =========================

                case "music_skip": {

                    const currentTrack = player.queue.current;

                    if (!currentTrack) {
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("#808080")
                                    .setDescription(
                                        "❌ ماكو أغنية تشتغل."
                                    )
                            ],
                            ephemeral: true
                        });
                    }

                    // Save current track to history
                    addHistory(
                        interaction.guildId,
                        currentTrack
                    );

                    await player.skip();

                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("#808080")
                                .setDescription("⏭️ تم تخطي الأغنية.")
                        ],
                        ephemeral: true
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
                // PREVIOUS
                // =========================

                case "music_previous": {

                    const previousTrack = getPrevious(
                        interaction.guildId
                    );

                    if (!previousTrack) {
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("#808080")
                                    .setDescription(
                                        "❌ ماكو أغنية سابقة."
                                    )
                            ],
                            ephemeral: true
                        });
                    }

                    const currentTrack = player.queue.current;

                    // Save current track so it can be returned to later
                    if (currentTrack) {
                        addHistory(
                            interaction.guildId,
                            currentTrack
                        );
                    }

                    // Stop current track
                    await player.stopPlaying();

                    // Add previous track normally
                    player.queue.add(previousTrack);

                    // Play previous track
                    await player.play();

                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("#808080")
                                .setDescription(
                                    `⏮️ عم تشتغل الأغنية السابقة: **${previousTrack.info?.title || "عنوان غير معروف"}**`
                                )
                        ],
                        ephemeral: true
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
                            .setColor("#808080")
                            .setDescription(
                                "❌ صار في خطأ وحنا نستخدم هذا الزر."
                            )
                    ],
                    ephemeral: true
                }).catch(() => {});
            }
        }
    }
};