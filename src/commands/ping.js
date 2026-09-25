const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",

    async execute({ client, message }) {
        try {
            const sent = await message.channel.send("ðŸ“ Ø¹Ù… Ø£ÙØ­Øµ Ø§Ù„Ø§ØªØµØ§Ù„...");

            const messageLatency =
                sent.createdTimestamp - message.createdTimestamp;

            const websocketLatency =
                client.ws.ping;

            let status = "ðŸŸ¢ Ù…Ù…ØªØ§Ø²";

            if (websocketLatency >= 150 && websocketLatency < 300) {
                status = "ðŸŸ¡ Ø¬ÙŠØ¯";
            } else if (websocketLatency >= 300) {
                status = "ðŸ”´ Ø¨Ø·ÙŠØ¡";
            }

            const embed = new EmbedBuilder()
                .setColor("#808080")
                .setAuthor({
                    name: "anas Music â€¢ Ø­Ø§Ù„Ø© Ø§Ù„Ù†Ø¸Ø§Ù…"
                })
                .setTitle("âš¡ ÙØ­Øµ Ø§Ù„Ø§ØªØµØ§Ù„")
                .setDescription(
                    "ÙƒÙ„Ø´ÙŠ ØªÙ…Ø§Ù…. Ù‡Ø§ÙŠ Ø­Ø§Ù„Ø© Ø§Ù„Ø§ØªØµØ§Ù„ Ø§Ù„Ø­Ø§Ù„ÙŠØ©."
                )
                .addFields(
                    {
                        name: "ðŸ¤– Ø§Ø³ØªØ¬Ø§Ø¨Ø© Ø§Ù„Ø¨ÙˆØª",
                        value: `\`${messageLatency}ms\``,
                        inline: true
                    },
                    {
                        name: "ðŸŒ WebSocket",
                        value: `\`${websocketLatency}ms\``,
                        inline: true
                    },
                    {
                        name: "ðŸ“¡ Ø§Ù„Ø­Ø§Ù„Ø©",
                        value: status,
                        inline: true
                    }
                )
                .addFields({
                    name: "ðŸ‘¤ Ø·Ù„Ø¨Ù‡Ø§",
                    value: `${message.author}`,
                    inline: false
                })
                .setFooter({
                    text: "anas Music â€¢ Ù…Ø±Ø§Ù‚Ø¨ Ø§Ù„Ø£Ø¯Ø§Ø¡"
                })
                .setTimestamp();

            await sent.edit({
                content: null,
                embeds: [embed]
            });

        } catch (error) {
            console.error("âŒ Ping command error:", error);

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#808080")
                        .setDescription(
                            "âŒ Ù…Ø§ Ù‚Ø¯Ø±Øª Ø£ÙØ­Øµ Ø§ØªØµØ§Ù„ Ø§Ù„Ø¨ÙˆØª."
                        )
                ]
            }).catch(() => {});
        }
    }
};

