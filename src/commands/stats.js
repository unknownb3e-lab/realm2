const {
    EmbedBuilder
} = require("discord.js");

function formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];

    if (days) parts.push(`${days}ÙŠ`);
    if (hours) parts.push(`${hours}Ø³`);
    if (minutes) parts.push(`${minutes}Ø¯`);
    if (secs || parts.length === 0) {
        parts.push(`${secs}Ø«`);
    }

    return parts.join(" ");
}

function formatMemory(bytes) {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

module.exports = {
    name: "stats",

    async execute({ client, message }) {
        try {
            const uptime = formatUptime(
                client.uptime || process.uptime() * 1000
            );

            const memory = process.memoryUsage();

            const guildCount =
                client.guilds.cache.size;

            const userCount =
                client.guilds.cache.reduce(
                    (total, guild) =>
                        total + (guild.memberCount || 0),
                    0
                );

            const activePlayers =
                client.lavalink?.players?.size || 0;

            const nodeManager =
                client.lavalink?.nodeManager;

            const nodes =
                nodeManager?.nodes
                    ? [...nodeManager.nodes.values()]
                    : [];

            const connectedNodes =
                nodes.filter(
                    node =>
                        node.connected === true
                ).length;

            const totalNodes =
                nodes.length;

            const ping =
                client.ws.ping >= 0
                    ? `${client.ws.ping}ms`
                    : "N/A";

            const embed =
                new EmbedBuilder()
                    .setColor("#808080")
                    .setTitle("ðŸ“Š Ø¥Ø­ØµØ§Ø¦ÙŠØ§Øª anas")
                    .setDescription(
                        "Ù‡Ø§ÙŠ Ø¥Ø­ØµØ§Ø¦ÙŠØ§ØªÙŠ Ø§Ù„Ø­ÙŠØ© Ø§Ù„Ø­Ø§Ù„ÙŠØ©."
                    )
                    .addFields(
                        {
                            name: "ðŸŒ Ø§Ù„Ø³ÙŠØ±ÙØ±Ø§Øª",
                            value: `\`${guildCount}\``,
                            inline: true
                        },
                        {
                            name: "ðŸ‘¥ Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…ÙŠÙ†",
                            value: `\`${userCount.toLocaleString()}\``,
                            inline: true
                        },
                        {
                            name: "ðŸ“ Ø§Ù„Ø¨ÙŠÙ†Øº",
                            value: `\`${ping}\``,
                            inline: true
                        },
                        {
                            name: "â±ï¸ Ù…Ø¯Ø© Ø§Ù„ØªØ´ØºÙŠÙ„",
                            value: `\`${uptime}\``,
                            inline: true
                        },
                        {
                            name: "ðŸŽµ Ø§Ù„Ù…Ø´ØºÙ„Ø§Øª Ø§Ù„ÙØ¹Ø§Ù„Ø©",
                            value: `\`${activePlayers}\``,
                            inline: true
                        },
                        {
                            name: "ðŸŸ¢ Lavalink",
                            value:
                                totalNodes > 0
                                    ? `\`${connectedNodes}/${totalNodes}\``
                                    : "`N/A`",
                            inline: true
                        },
                        {
                            name: "ðŸ’¾ Ø§Ù„Ø°Ø§ÙƒØ±Ø©",
                            value: `\`${formatMemory(memory.rss)}\``,
                            inline: true
                        },
                        {
                            name: "ðŸ§  Heap",
                            value: `\`${formatMemory(memory.heapUsed)} / ${formatMemory(memory.heapTotal)}\``,
                            inline: true
                        },
                        {
                            name: "ðŸ¤– Discord.js",
                            value: `\`v${require("discord.js").version}\``,
                            inline: true
                        }
                    )
                    .setFooter({
                        text: "anas Music â€¢ Ø¥Ø­ØµØ§Ø¦ÙŠØ§Øª Ø­ÙŠØ©"
                    })
                    .setTimestamp();

            await message.channel.send({
                embeds: [embed]
            });

        } catch (error) {
            console.error(
                "âŒ Stats command error:",
                error
            );

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#808080")
                        .setDescription(
                            "âŒ ØµØ§Ø± ÙÙŠ Ø®Ø·Ø£ ÙˆØ­Ù†Ø§ Ù†Ø¬ÙŠØ¨ Ø¥Ø­ØµØ§Ø¦ÙŠØ§Øª Ø§Ù„Ø¨ÙˆØª."
                        )
                ]
            }).catch(() => {});
        }
    }
};

