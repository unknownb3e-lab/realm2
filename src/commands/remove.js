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
    name: "remove",

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
            // ARGUMENT CHECK
            // ==========================================

            if (
                args.length < 2 ||
                args[0].toLowerCase() !== "queue"
            ) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ الاستخدام: `>remove queue <رقم>`\n\nمثال: `>remove queue 2`"
                        )
                    ]
                });
            }

            const position = Number(args[1]);

            if (!Number.isInteger(position) || position < 1) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ الرجاء كتابة رقم صحيح بالقائمة."
                        )
                    ]
                });
            }

            // ==========================================
            // GET QUEUE
            // ==========================================

            const queue = player.queue;

            if (!queue || !queue.tracks) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ القائمة فاضية."
                        )
                    ]
                });
            }

            if (position > queue.tracks.length) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            `❌ ماكو أغنية بالرقم **${position}** بالقائمة.`
                        )
                    ]
                });
            }

            // ==========================================
            // GET TRACK
            // ==========================================

            const track = queue.tracks[position - 1];

            const title =
                track?.info?.title || "عنوان غير معروف";

            // ==========================================
            // REMOVE TRACK
            // ==========================================

            queue.remove(position - 1);

            // ==========================================
            // SUCCESS
            // ==========================================

            await message.channel.send({
                embeds: [
                    createEmbed(
                        `🗑️ تم حذف **${title}** من القائمة.`
                    )
                ]
            });

        } catch (error) {
            console.error(
                "❌ Remove command error:",
                error
            );

            await message.reply({
                embeds: [
                    createEmbed(
                        "❌ صار في خطأ وحنا نحذف هاي الأغنية."
                    )
                ]
            }).catch(() => {});
        }
    }
};
