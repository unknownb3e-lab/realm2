const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "stop",

    async execute({ client, message }) {
        try {
            const player = client.lavalink.getPlayer(message.guild.id);

            if (!player) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#808080")
                            .setDescription("âŒ Ù…Ø§ÙƒÙˆ Ù…Ø´ØºÙ„ Ù…ÙˆØ³ÙŠÙ‚Ù‰ Ø´ØºØ§Ù„ Ø­Ø§Ù„ÙŠÙ‹Ø§.")
                    ]
                });
            }

            const voiceChannel = message.member?.voice?.channel;

            if (!voiceChannel) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#808080")
                            .setDescription(
                                "âŒ Ù„Ø§Ø²Ù… ØªÙƒÙˆÙ† Ø¨Ø±ÙˆÙ… ØµÙˆØªÙŠ Ø­ØªÙ‰ ØªØ³ØªØ®Ø¯Ù… Ù‡Ø°Ø§ Ø§Ù„Ø£Ù…Ø±."
                            )
                    ]
                });
            }

            if (
                player.voiceChannelId &&
                player.voiceChannelId !== voiceChannel.id
            ) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#808080")
                            .setDescription(
                                "âŒ Ù„Ø§Ø²Ù… ØªÙƒÙˆÙ† Ø¨Ù†ÙØ³ Ø§Ù„Ø±ÙˆÙ… Ø§Ù„ØµÙˆØªÙŠ Ù…Ø¹ Ø§Ù„Ø¨ÙˆØª."
                            )
                    ]
                });
            }

            // ==========================================
            // CHECK 24/7
            // ==========================================

            const is247 = player.getData("247") === true;

            // ==========================================
            // STOP MUSIC
            // ==========================================

            await player.stopPlaying();

            // ==========================================
            // CLEAR QUEUE
            // ==========================================

            if (player.queue?.tracks) {
                while (player.queue.tracks.length > 0) {
                    player.queue.remove(0);
                }
            }

            // ==========================================
            // DISCONNECT ONLY IF 24/7 IS OFF
            // ==========================================

            if (!is247) {
                await player.disconnect();
            }

            // ==========================================
            // RESPONSE
            // ==========================================

            const embed = new EmbedBuilder()
                .setColor("#808080")
                .setDescription(
                    is247
                        ? "â¹ï¸ ØªÙ… Ø¥ÙŠÙ‚Ø§Ù Ø§Ù„Ù…ÙˆØ³ÙŠÙ‚Ù‰ ÙˆØªÙØ±ÙŠØº Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©.\nðŸ”’ **ÙˆØ¶Ø¹ 24/7 Ù…ÙØ¹Ù‘Ù„ØŒ ÙØ±Ø­ Ø£Ø¶Ù„ Ø¨Ø§Ù„Ø±ÙˆÙ… Ø§Ù„ØµÙˆØªÙŠ.**"
                        : "â¹ï¸ ØªÙ… Ø¥ÙŠÙ‚Ø§Ù Ø§Ù„Ù…ÙˆØ³ÙŠÙ‚Ù‰ ÙˆØªÙØ±ÙŠØº Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©."
                )
                .setFooter({
                    text: "anas Music"
                });

            await message.channel.send({
                embeds: [embed]
            });

        } catch (error) {
            console.error("âŒ Stop command error:", error);

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#808080")
                        .setDescription(
                            "âŒ ØµØ§Ø± ÙÙŠ Ø®Ø·Ø£ ÙˆØ­Ù†Ø§ Ù†ÙˆÙ‚Ù Ø§Ù„Ù…ÙˆØ³ÙŠÙ‚Ù‰."
                        )
                ]
            }).catch(() => {});
        }
    }
};

