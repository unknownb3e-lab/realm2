const { EmbedBuilder } = require("discord.js");

function createEmbed(description) {
    return new EmbedBuilder()
        .setColor("#2a2a2a")
        .setDescription(description)
        .setFooter({
            text: "anas Music"
        });
}

module.exports = {
    name: "clear",

    async execute({ client, message, args }) {
        try {
            const player = client.lavalink.getPlayer(
                message.guild.id
            );

            if (!player) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ Ù…Ø§ÙƒÙˆ Ù…Ø´ØºÙ„ Ù…ÙˆØ³ÙŠÙ‚Ù‰ Ø´ØºØ§Ù„ Ø­Ø§Ù„ÙŠÙ‹Ø§."
                        )
                    ]
                });
            }

            const voiceChannel =
                message.member?.voice?.channel;

            if (!voiceChannel) {
                return message.reply({
                    embeds: [
                        createEmbed(
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
                        createEmbed(
                            "❌ Ù„Ø§Ø²Ù… ØªÙƒÙˆÙ† Ø¨Ù†ÙØ³ Ø§Ù„Ø±ÙˆÙ… Ø§Ù„ØµÙˆØªÙŠ Ù…Ø¹ Ø§Ù„Ø¨ÙˆØª."
                        )
                    ]
                });
            }

            // ==========================================
            // COMMAND CHECK
            // ==========================================

            if (
                !args.length ||
                args[0].toLowerCase() !== "queue"
            ) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ Ø§Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù…: `>clear queue`"
                        )
                    ]
                });
            }

            // ==========================================
            // QUEUE CHECK
            // ==========================================

            const queue = player.queue;

            if (!queue || !queue.tracks) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© ÙØ§Ø¶ÙŠØ© Ø£ØµÙ„Ø§Ù‹."
                        )
                    ]
                });
            }

            if (queue.tracks.length === 0) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© ÙØ§Ø¶ÙŠØ© Ø£ØµÙ„Ø§Ù‹."
                        )
                    ]
                });
            }

            const count = queue.tracks.length;

            // ==========================================
            // CLEAR WAITING QUEUE
            // ==========================================

            while (queue.tracks.length > 0) {
                queue.remove(0);
            }

            // ==========================================
            // SUCCESS
            // ==========================================

            await message.channel.send({
                embeds: [
                    createEmbed(
                        `🗑️ ØªÙ… Ø­Ø°Ù **${count} Ø£ØºÙ†ÙŠØ©** Ù…Ù† Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©.`
                    )
                ]
            });

        } catch (error) {
            console.error(
                "❌ Clear queue command error:",
                error
            );

            await message.reply({
                embeds: [
                    createEmbed(
                        "❌ ØµØ§Ø± ÙÙŠ Ø®Ø·Ø£ ÙˆØ­Ù†Ø§ Ù†ÙØ±Ù‘Øº Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©."
                    )
                ]
            }).catch(() => {});
        }
    }
};

