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
    interaction.customId.startsWith("anas_help_")
) {
    return;
}

        const player = client.lavalink.getPlayer(interaction.guildId);

        if (!player) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#808080")
                        .setDescription("❌ Ù…Ø§ÙƒÙˆ Ù…Ø´ØºÙ„ Ù…ÙˆØ³ÙŠÙ‚Ù‰ Ø´ØºØ§Ù„ Ø­Ø§Ù„ÙŠÙ‹Ø§.")
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
                            "❌ Ù„Ø§Ø²Ù… ØªÙƒÙˆÙ† Ø¨Ø±ÙˆÙ… ØµÙˆØªÙŠ Ø­ØªÙ‰ ØªØ³ØªØ®Ø¯Ù… Ø£Ø²Ø±Ø§Ø± Ø§Ù„ØªØ­ÙƒÙ…."
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
                            "❌ Ù„Ø§Ø²Ù… ØªÙƒÙˆÙ† Ø¨Ù†ÙØ³ Ø§Ù„Ø±ÙˆÙ… Ø§Ù„ØµÙˆØªÙŠ Ù…Ø¹ Ø§Ù„Ø¨ÙˆØª."
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
                                        "❌ Ù…Ø§ÙƒÙˆ Ø£ØºÙ†ÙŠØ© ØªØ´ØªØºÙ„."
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
                                .setDescription("⏭️ ØªÙ… ØªØ®Ø·ÙŠ Ø§Ù„Ø£ØºÙ†ÙŠØ©.")
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
                                        "❌ Ù…Ø§ÙƒÙˆ Ø£ØºÙ†ÙŠØ© Ø³Ø§Ø¨Ù‚Ø©."
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
                                    `⏮️ Ø¹Ù… ØªØ´ØªØºÙ„ Ø§Ù„Ø£ØºÙ†ÙŠØ© Ø§Ù„Ø³Ø§Ø¨Ù‚Ø©: **${previousTrack.info?.title || "Ø¹Ù†ÙˆØ§Ù† ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙ"}**`
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
                                "❌ ØµØ§Ø± ÙÙŠ Ø®Ø·Ø£ ÙˆØ­Ù†Ø§ Ù†Ø³ØªØ®Ø¯Ù… Ù‡Ø°Ø§ Ø§Ù„Ø²Ø±."
                            )
                    ],
                    ephemeral: true
                }).catch(() => {});
            }
        }
    }
};
