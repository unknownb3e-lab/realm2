const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",

    async execute({ client, message }) {
        try {
            const sent = await message.channel.send("🏓 عم افحص الاتصال...");

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
                    name: "anas Music • حالة النظام"
                })
                .setTitle("⚡ فحص الاتصال")
                .setDescription(
                    "كلي تمارك. هاي حالة الاتصال الحالية."
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
                    text: "anas Music • مراقب الأداء"
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
                            "❌ ما قدرت افحص اتصال البوت."
                        )
                ]
            }).catch(() => {});
        }
    }
};
