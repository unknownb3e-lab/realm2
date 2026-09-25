const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "leave",

    async execute({ client, message }) {
        try {
            const player = client.lavalink.getPlayer(
                message.guild.id
            );

            if (!player || !player.connected) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#808080")
                            .setDescription(
                                "âŒ Ø£Ù†Ø§ Ù…Ùˆ Ù…ØªØµÙ„ Ø¨Ø±ÙˆÙ… ØµÙˆØªÙŠ."
                            )
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
            // 24/7 CHECK
            // ==========================================

            const is247 =
                player.getData("247") === true;

            if (is247) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#808080")
                            .setDescription(
                                "ðŸ”’ **ÙˆØ¶Ø¹ 24/7 Ù…ÙØ¹Ù‘Ù„.**\n\nÙ…Ø§ Ø£Ù‚Ø¯Ø± Ø£Ø·Ù„Ø¹ Ù…Ù† Ø§Ù„Ø±ÙˆÙ… Ø§Ù„ØµÙˆØªÙŠ ÙˆÙ‡Ùˆ Ø´ØºØ§Ù„."
                            )
                            .setFooter({
                                text: "anas Music"
                            })
                    ]
                });
            }

            // ==========================================
            // MARK MANUAL LEAVE
            // ==========================================

            player.setData("manualLeave", true);

            // ==========================================
            // STOP MUSIC
            // ==========================================

            if (player.playing || player.paused) {
                await player.stopPlaying();
            }

            // ==========================================
            // CLEAR QUEUE
            // ==========================================

            if (
                player.queue &&
                typeof player.queue.clear === "function"
            ) {
                player.queue.clear();
            }

            // ==========================================
            // DISCONNECT
            // ==========================================

            await player.disconnect();

            // ==========================================
            // SUCCESS MESSAGE
            // ==========================================

            const embed = new EmbedBuilder()
                .setColor("#808080")
                .setTitle("ðŸ‘‹ ØªÙ… Ù‚Ø·Ø¹ Ø§Ù„Ø§ØªØµØ§Ù„")
                .setDescription(
                    "Ø·Ù„Ø¹Øª Ù…Ù† Ø§Ù„Ø±ÙˆÙ… Ø§Ù„ØµÙˆØªÙŠ ÙˆÙØ±Ù‘ØºØª Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø£ØºØ§Ù†ÙŠ."
                )
                .setFooter({
                    text: "anas Music"
                });

            await message.channel.send({
                embeds: [embed]
            });

        } catch (error) {
            console.error(
                "âŒ Leave command error:",
                error
            );

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#808080")
                        .setDescription(
                            "âŒ ØµØ§Ø± ÙÙŠ Ø®Ø·Ø£ ÙˆØ­Ù†Ø§ Ù†Ø·Ù„Ø¹ Ù…Ù† Ø§Ù„Ø±ÙˆÙ… Ø§Ù„ØµÙˆØªÙŠ."
                        )
                ]
            }).catch(() => {});
        }
    }
};

