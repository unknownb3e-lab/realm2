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
    name: "shuffle",

    async execute({ client, message }) {
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

            const voiceChannel = message.member?.voice?.channel;

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
            // CHECK QUEUE
            // ==========================================

            const queue = player.queue;

            if (!queue || !queue.tracks || queue.tracks.length < 2) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ لازم يكون في **2 أغاني عالأقل بالقائمة** حتى تخلط."
                        )
                    ]
                });
            }

            // ==========================================
            // SHUFFLE QUEUE
            // ==========================================

            const tracks = [...queue.tracks];

            for (let i = tracks.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));

                [tracks[i], tracks[j]] = [
                    tracks[j],
                    tracks[i]
                ];
            }

            // Clear existing queue
            while (queue.tracks.length > 0) {
                queue.remove(0);
            }

            // Add shuffled tracks
            for (const track of tracks) {
                queue.add(track);
            }

            // ==========================================
            // SUCCESS
            // ==========================================

            await message.channel.send({
                embeds: [
                    createEmbed(
                        `🔀 تم خلط **${tracks.length} أغنية** بالقائمة.`
                    )
                ]
            });

        } catch (error) {
            console.error(
                "❌ Shuffle command error:",
                error
            );

            await message.reply({
                embeds: [
                    createEmbed(
                        "❌ صار في خطأ وحنا نخلط القائمة."
                    )
                ]
            }).catch(() => {});
        }
    }
};
