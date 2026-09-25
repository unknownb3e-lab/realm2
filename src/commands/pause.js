const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "pause",

    async execute({ client, message }) {
        try {
            const player = client.lavalink.getPlayer(message.guild.id);

            if (!player) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#2a2a2a")
                            .setDescription("❌ Ù…Ø§ÙƒÙˆ Ù…Ø´ØºÙ„ Ù…ÙˆØ³ÙŠÙ‚Ù‰ Ø´ØºØ§Ù„ Ø­Ø§Ù„ÙŠÙ‹Ø§.")
                    ]
                });
            }

            const voiceChannel = message.member?.voice?.channel;

            if (!voiceChannel) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#2a2a2a")
                            .setDescription(
                                "❌ Ù„Ø§Ø²Ù… ØªÙƒÙˆÙ† Ø¨Ø±ÙˆÙ… ØµÙˆØªÙŠ Ø­ØªÙ‰ ØªØ³ØªØ®Ø¯Ù… Ù‡Ø°Ø§ Ø§Ù„Ø£Ù…Ø±."
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
                            .setColor("#2a2a2a")
                            .setDescription(
                                "❌ Ù„Ø§Ø²Ù… ØªÙƒÙˆÙ† Ø¨Ù†ÙØ³ Ø§Ù„Ø±ÙˆÙ… Ø§Ù„ØµÙˆØªÙŠ Ù…Ø¹ Ø§Ù„Ø¨ÙˆØª."
                            )
                    ]
                });
            }

            if (player.paused) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#2a2a2a")
                            .setDescription("⏸️ Ø§Ù„Ù…ÙˆØ³ÙŠÙ‚Ù‰ Ù…ØªÙˆÙ‚ÙØ© Ù…Ø¤Ù‚ØªÙ‹Ø§ Ø£ØµÙ„Ø§Ù‹.")
                    ]
                });
            }

            await player.pause();

            const embed = new EmbedBuilder()
                .setColor("#2a2a2a")
                .setDescription("⏸️ ØªÙ… Ø¥ÙŠÙ‚Ø§Ù Ø§Ù„Ù…ÙˆØ³ÙŠÙ‚Ù‰ Ù…Ø¤Ù‚ØªÙ‹Ø§.")
                .setFooter({
                    text: "anas Music"
                });

            await message.channel.send({
                embeds: [embed]
            });

        } catch (error) {
            console.error("❌ Pause command error:", error);

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2a2a2a")
                        .setDescription(
                            "❌ ØµØ§Ø± ÙÙŠ Ø®Ø·Ø£ ÙˆØ­Ù†Ø§ Ù†ÙˆÙ‚Ù Ø§Ù„Ù…ÙˆØ³ÙŠÙ‚Ù‰ Ù…Ø¤Ù‚ØªÙ‹Ø§."
                        )
                ]
            }).catch(() => {});
        }
    }
};

