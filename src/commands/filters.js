const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "filters",

    async execute({ message }) {
        const embed = new EmbedBuilder()
            .setColor("#808080")
            .setAuthor({
                name: "Yowa Music • فلاتر الصوت"
            })
            .setTitle("🎚️ الفلاتر المتوفرة")
            .setDescription(
                "غيّر صوت المقطع الحالي باستخدام أحد الفلاتر بالأسفل."
            )
            .addFields(
                {
                    name: "🔊 تعزيز الباص",
                    value: "`>filter bassboost`\nيعزز الباص لصوت أعمق.",
                    inline: false
                },
                {
                    name: "🌙 Nightcore",
                    value: "`>filter nightcore`\nيزيد السرعة والنبرة.",
                    inline: false
                },
                {
                    name: "🐌 تبطيء",
                    value: "`>filter slowed`\nيبطّئ الأغنية الحالية.",
                    inline: false
                },
                {
                    name: "⚡ تسريع",
                    value: "`>filter speedup`\nيخلي الأغنية الحالية تشتغل أسرع.",
                    inline: false
                },
                {
                    name: "🎚️ طبيعي",
                    value: "`>filter normal`\nيشيل كل الفلاتر الفعالة.",
                    inline: false
                }
            )
            .setFooter({
                text: `Yowa Music • طلبها ${message.author.username}`
            })
            .setTimestamp();

        await message.channel.send({
            embeds: [embed]
        });
    }
};
