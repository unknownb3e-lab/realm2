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
            // COMMAND CHECK
            // ==========================================

            if (
                !args.length ||
                args[0].toLowerCase() !== "queue"
            ) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ الاستخدام: `>clear queue`"
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
                            "❌ القائمة فاضية أصلاً."
                        )
                    ]
                });
            }

            if (queue.tracks.length === 0) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ القائمة فاضية أصلاً."
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
                        `🗑️ تم حذف **${count} أغنية** من القائمة.`
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
                        "❌ صار في خطأ وحنا نفرّغ القائمة."
                    )
                ]
            }).catch(() => {});
        }
    }
};
