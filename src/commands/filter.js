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
    name: "filter",

    async execute({ client, message, args }) {
        try {
            const player = client.lavalink.getPlayer(
                message.guild.id
            );

            if (!player) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ ماكو مشغل موسيقى شغال حالياً."
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
                            "❌ لازم تكون بروم صوتي حتى تستخدم هاذا الأمر."
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
                            "❌ لازم تكون بنفس الروم الصوتي مع البوت."
                        )
                    ]
                });
            }

            if (!player.queue.current) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ ماكو أغنية تشتغل حالياً."
                        )
                    ]
                });
            }

            const filter = args
                .join("")
                .toLowerCase();

            if (!filter) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ الرجاء كتابة اسم الفلتر.\n\nمثال: `>filter bassboost`"
                        )
                    ]
                });
            }

            const filterManager =
                player.filterManager;

            if (!filterManager) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ الفلاتر مو متوفرة بهاذا المشغل."
                        )
                    ]
                });
            }

            // ==========================================
            // NORMAL / RESET
            // ==========================================

            if (
                filter === "normal" ||
                filter === "reset" ||
                filter === "off"
            ) {
                await filterManager.resetFilters();

                return message.channel.send({
                    embeds: [
                        createEmbed(
                            "🎛️ **تمت إعادة ضبط الفلاتر!**\n\nرجعت الأغنية لوضعها الطبيعي."
                        )
                    ]
                });
            }

            // ==========================================
            // BASSBOOST
            // ==========================================

            if (
                filter === "bassboost" ||
                filter === "bass"
            ) {
                await filterManager.resetFilters();

                filterManager.equalizerBands = [
                    { band: 0, gain: 0.35 },
                    { band: 1, gain: 0.30 },
                    { band: 2, gain: 0.25 },
                    { band: 3, gain: 0.20 },
                    { band: 4, gain: 0.15 }
                ];

                filterManager.filters.equalizer = true;

                await filterManager.applyPlayerFilters();

                return message.channel.send({
                    embeds: [
                        createEmbed(
                            "🔊 **تم تفعيل تعزيز الباص!**\n\nصار الباص أقوى."
                        )
                    ]
                });
            }

            // ==========================================
            // NIGHTCORE
            // ==========================================

            if (filter === "nightcore") {
                await filterManager.resetFilters();

                filterManager.data.timescale = {
                    speed: 1.25,
                    pitch: 1.25,
                    rate: 1
                };

                filterManager.filters.timescale = true;

                await filterManager.applyPlayerFilters();

                return message.channel.send({
                    embeds: [
                        createEmbed(
                            "🌙 **تم تفعيل Nightcore!**\n\nزادت السرعة والنبرة."
                        )
                    ]
                });
            }

            // ==========================================
            // SLOWED
            // ==========================================

            if (
                filter === "slowed" ||
                filter === "slow"
            ) {
                await filterManager.resetFilters();

                await filterManager.setSpeed(0.80);

                return message.channel.send({
                    embeds: [
                        createEmbed(
                            "🐾 **تم تفعيل التبطيء!**\n\nصارت الأغنية تشتغل أبطأ."
                        )
                    ]
                });
            }

            // ==========================================
            // SPEED UP
            // ==========================================

            if (
                filter === "speedup" ||
                filter === "spedup" ||
                filter === "speed"
            ) {
                await filterManager.resetFilters();

                await filterManager.setSpeed(1.25);

                return message.channel.send({
                    embeds: [
                        createEmbed(
                            "⚡ **تم تفعيل التسريع!**\n\nصارت الأغنية تشتغل أسرع."
                        )
                    ]
                });
            }

            // ==========================================
            // UNKNOWN FILTER
            // ==========================================

            return message.reply({
                embeds: [
                    createEmbed(
                        `❌ فلتر غير معروف: **${args.join(" ")}**\n\nاستخدم \`>filters\` لتشوف الفلاتر المتوفرة.`
                    )
                ]
            });

        } catch (error) {
            console.error(
                "❌ Filter command error:",
                error
            );

            await message.reply({
                embeds: [
                    createEmbed(
                        "❌ صار في خطأ وحنا نطبق الفلتر."
                    )
                ]
            }).catch(() => {});
        }
    }
};
