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
                        .setColor("#2a2a2a")
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
                        .setColor("#2a2a2a")
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
                        .setColor("#2a2a2a")
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
                                "❌ ØµØ§Ø± ÙÙŠ Ø®Ø·Ø£ ÙˆØ­Ù†Ø§ Ù†Ø³ØªØ®Ø¯Ù… Ù‡Ø°Ø§ Ø§Ù„Ø²Ø±."
                            )
                    ],
                    ephemeral: true
                }).catch(() => {});
            }
        }
    }
};
