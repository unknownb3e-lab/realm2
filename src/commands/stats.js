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

    if (days) parts.push(`${days}ي`);
    if (hours) parts.push(`${hours}س`);
    if (minutes) parts.push(`${minutes}د`);
    if (secs || parts.length === 0) {
        parts.push(`${secs}ث`);
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
                    .setTitle("📊 إحصائيات anas")
                    .setDescription(
                        "هاي إحصائياتي الحية الحالية."
                    )
                    .addFields(
                        {
                            name: "🌐 السيرفرات",
                            value: `\`${guildCount}\``,
                            inline: true
                        },
                        {
                            name: "👥 المستخدمين",
                            value: `\`${userCount.toLocaleString()}\``,
                            inline: true
                        },
                        {
                            name: "🏓 البينغ",
                            value: `\`${ping}\``,
                            inline: true
                        },
                        {
                            name: "⏱️ مدة التشغيل",
                            value: `\`${uptime}\``,
                            inline: true
                        },
                        {
                            name: "🎵 المشغلات الفعالة",
                            value: `\`${activePlayers}\``,
                            inline: true
                        },
                        {
                            name: "🟢 Lavalink",
                            value:
                                totalNodes > 0
                                    ? `\`${connectedNodes}/${totalNodes}\``
                                    : "`N/A`",
                            inline: true
                        },
                        {
                            name: "💾 الذاكرة",
                            value: `\`${formatMemory(memory.rss)}\``,
                            inline: true
                        },
                        {
                            name: "🧠 Heap",
                            value: `\`${formatMemory(memory.heapUsed)} / ${formatMemory(memory.heapTotal)}\``,
                            inline: true
                        },
                        {
                            name: "🤖 Discord.js",
                            value: `\`v${require("discord.js").version}\``,
                            inline: true
                        }
                    )
                    .setFooter({
                        text: "anas Music • إحصائيات حية"
                    })
                    .setTimestamp();

            await message.channel.send({
                embeds: [embed]
            });

        } catch (error) {
            console.error(
                "❌ Stats command error:",
                error
            );

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#808080")
                        .setDescription(
                            "❌ صار في خطأ وحنا نجيب إحصائيات البوت."
                        )
                ]
            }).catch(() => {});
        }
    }
};
