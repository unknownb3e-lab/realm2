const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "filters",

    async execute({ message }) {
        const embed = new EmbedBuilder()
            .setColor("#808080")
            .setAuthor({
                name: "anas Music â€¢ ÙÙ„Ø§ØªØ± Ø§Ù„ØµÙˆØª"
            })
            .setTitle("ðŸŽšï¸ Ø§Ù„ÙÙ„Ø§ØªØ± Ø§Ù„Ù…ØªÙˆÙØ±Ø©")
            .setDescription(
                "ØºÙŠÙ‘Ø± ØµÙˆØª Ø§Ù„Ù…Ù‚Ø·Ø¹ Ø§Ù„Ø­Ø§Ù„ÙŠ Ø¨Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø£Ø­Ø¯ Ø§Ù„ÙÙ„Ø§ØªØ± Ø¨Ø§Ù„Ø£Ø³ÙÙ„."
            )
            .addFields(
                {
                    name: "ðŸ”Š ØªØ¹Ø²ÙŠØ² Ø§Ù„Ø¨Ø§Øµ",
                    value: "`>filter bassboost`\nÙŠØ¹Ø²Ø² Ø§Ù„Ø¨Ø§Øµ Ù„ØµÙˆØª Ø£Ø¹Ù…Ù‚.",
                    inline: false
                },
                {
                    name: "ðŸŒ™ Nightcore",
                    value: "`>filter nightcore`\nÙŠØ²ÙŠØ¯ Ø§Ù„Ø³Ø±Ø¹Ø© ÙˆØ§Ù„Ù†Ø¨Ø±Ø©.",
                    inline: false
                },
                {
                    name: "ðŸŒ ØªØ¨Ø·ÙŠØ¡",
                    value: "`>filter slowed`\nÙŠØ¨Ø·Ù‘Ø¦ Ø§Ù„Ø£ØºÙ†ÙŠØ© Ø§Ù„Ø­Ø§Ù„ÙŠØ©.",
                    inline: false
                },
                {
                    name: "âš¡ ØªØ³Ø±ÙŠØ¹",
                    value: "`>filter speedup`\nÙŠØ®Ù„ÙŠ Ø§Ù„Ø£ØºÙ†ÙŠØ© Ø§Ù„Ø­Ø§Ù„ÙŠØ© ØªØ´ØªØºÙ„ Ø£Ø³Ø±Ø¹.",
                    inline: false
                },
                {
                    name: "ðŸŽšï¸ Ø·Ø¨ÙŠØ¹ÙŠ",
                    value: "`>filter normal`\nÙŠØ´ÙŠÙ„ ÙƒÙ„ Ø§Ù„ÙÙ„Ø§ØªØ± Ø§Ù„ÙØ¹Ø§Ù„Ø©.",
                    inline: false
                }
            )
            .setFooter({
                text: `anas Music â€¢ Ø·Ù„Ø¨Ù‡Ø§ ${message.author.username}`
            })
            .setTimestamp();

        await message.channel.send({
            embeds: [embed]
        });
    }
};

