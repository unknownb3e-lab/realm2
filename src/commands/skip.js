const { EmbedBuilder } = require("discord.js");
const { addHistory } = require("../utils/musicHistory");

module.exports = {
    name: "skip",

    async execute({ client, message }) {
        try {
            const player = client.lavalink.getPlayer(message.guild.id);

            if (!player) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#808080")
                            .setDescription(
                                "âŒ Ù…Ø§ÙƒÙˆ Ù…Ø´ØºÙ„ Ù…ÙˆØ³ÙŠÙ‚Ù‰ Ø´ØºØ§Ù„ Ø­Ø§Ù„ÙŠÙ‹Ø§."
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

            const currentTrack = player.queue.current;

            if (!currentTrack) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#808080")
                            .setDescription(
                                "âŒ Ù…Ø§ÙƒÙˆ Ø£ØºÙ†ÙŠØ© ØªØ´ØªØºÙ„."
                            )
                    ]
                });
            }

            const skippedTitle =
                currentTrack.info?.title || "Ø§Ù„Ù…Ù‚Ø·Ø¹ Ø§Ù„Ø­Ø§Ù„ÙŠ";

            // ==========================================
            // SAVE CURRENT TRACK TO HISTORY
            // ==========================================

            addHistory(
                message.guild.id,
                currentTrack
            );

            // ==========================================
            // SKIP
            // ==========================================

            await player.skip();

            // ==========================================
            // RESPONSE
            // ==========================================

            const embed = new EmbedBuilder()
                .setColor("#808080")
                .setDescription(
                    `â­ï¸ ØªÙ… ØªØ®Ø·ÙŠ **${skippedTitle}**.`
                )
                .setFooter({
                    text: "anas Music"
                });

            await message.channel.send({
                embeds: [embed]
            });

        } catch (error) {
            console.error(
                "âŒ Skip command error:",
                error
            );

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#808080")
                        .setDescription(
                            "âŒ ØµØ§Ø± ÙÙŠ Ø®Ø·Ø£ ÙˆØ­Ù†Ø§ Ù†ØªØ®Ø·Ù‰ Ø§Ù„Ø£ØºÙ†ÙŠØ©."
                        )
                ]
            }).catch(() => {});
        }
    }
};

