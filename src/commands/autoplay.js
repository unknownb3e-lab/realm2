const { EmbedBuilder } = require("discord.js");

function createEmbed(description) {
    return new EmbedBuilder()
        .setColor("#808080")
        .setDescription(description)
        .setFooter({
            text: "Yowa Music"
        });
}

module.exports = {
    name: "autoplay",

    async execute({ client, message, args }) {
        try {
            const player = client.lavalink.getPlayer(
                message.guild.id
            );

            if (!player) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ ماكو مشغل موسيقى شغال حاليًا."
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
                            "❌ لازم تكون بروم صوتي حتى تستخدم هذا الأمر."
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

            // ==========================================
            // ON
            // ==========================================

            if (args[0]?.toLowerCase() === "on") {
                player.setData("autoplay", true);

                return message.channel.send({
                    embeds: [
                        createEmbed(
                            "🔄 **تم تفعيل التشغيل التلقائي.**\n\nرح أكمل بأغنية جديدة تلقائيًا لما تخلص القائمة."
                        )
                    ]
                });
            }

            // ==========================================
            // OFF
            // ==========================================

            if (args[0]?.toLowerCase() === "off") {
                player.setData("autoplay", false);

                return message.channel.send({
                    embeds: [
                        createEmbed(
                            "⏹️ **تم إيقاف التشغيل التلقائي.**"
                        )
                    ]
                });
            }

            // ==========================================
            // TOGGLE
            // ==========================================

            const current =
                player.getData("autoplay") === true;

            player.setData("autoplay", !current);

            return message.channel.send({
                embeds: [
                    createEmbed(
                        !current
                            ? "🔄 **تم تفعيل التشغيل التلقائي.**\n\nرح أكمل بأغنية جديدة تلقائيًا لما تخلص القائمة."
                            : "⏹️ **تم إيقاف التشغيل التلقائي.**"
                    )
                ]
            });

        } catch (error) {
            console.error(
                "❌ Autoplay command error:",
                error
            );

            await message.reply({
                embeds: [
                    createEmbed(
                        "❌ صار في خطأ وحنا نغير التشغيل التلقائي."
                    )
                ]
            }).catch(() => {});
        }
    }
};
