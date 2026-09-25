const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",

    async execute({ client, message }) {
        try {
            const sent = await message.channel.send("🏓 عم أفحص الاتصال...");

            const messageLatency =
                sent.createdTimestamp - message.createdTimestamp;

            const websocketLatency =
                client.ws.ping;

            let status = "🟢 ممتاز";

            if (websocketLatency >= 150 && websocketLatency < 300) {
                status = "🟡 جيد";
            } else if (websocketLatency >= 300) {
                status = "🔴 بطيء";
            }

            const embed = new EmbedBuilder()
                .setColor("#808080")
                .setAuthor({
                    name: "Yowa Music • حالة النظام"
                })
                .setTitle("⚡ فحص الاتصال")
                .setDescription(
                    "كلشي تمام. هاي حالة الاتصال الحالية."
                )
                .addFields(
                    {
                        name: "🤖 استجابة البوت",
                        value: `\`${messageLatency}ms\``,
                        inline: true
                    },
                    {
                        name: "🌐 WebSocket",
                        value: `\`${websocketLatency}ms\``,
                        inline: true
                    },
                    {
                        name: "📡 الحالة",
                        value: status,
                        inline: true
                    }
                )
                .addFields({
                    name: "👤 طلبها",
                    value: `${message.author}`,
                    inline: false
                })
                .setFooter({
                    text: "Yowa Music • مراقب الأداء"
                })
                .setTimestamp();

            await sent.edit({
                content: null,
                embeds: [embed]
            });

        } catch (error) {
            console.error("❌ Ping command error:", error);

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#808080")
                        .setDescription(
                            "❌ ما قدرت أفحص اتصال البوت."
                        )
                ]
            }).catch(() => {});
        }
    }
};
