const { EmbedBuilder } = require("discord.js");

function formatDuration(ms) {
    if (!ms || ms < 0) return "00:00";

    const totalSeconds = Math.floor(ms / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function errorEmbed(description) {
    return new EmbedBuilder()
        .setColor("#2a2a2a")
        .setDescription(`❌ ${description}`);
}

module.exports = {
    name: "queue",

    async execute({ client, message }) {
        try {
            // ==========================================
            // GET PLAYER
            // ==========================================

            const player = client.lavalink.getPlayer(
                message.guild.id
            );

            if (!player) {
                return message.reply({
                    embeds: [
                        errorEmbed(
                            "ماكو مشغل موسيقى شغال حالياً."
                        )
                    ]
                });
            }

            // ==========================================
            // CURRENT TRACK
            // ==========================================

            const currentTrack = player.queue.current;

            // ==========================================
            // QUEUE
            // ==========================================

            const tracks = player.queue.tracks || [];

            if (!currentTrack && tracks.length === 0) {
                return message.reply({
                    embeds: [
                        errorEmbed(
                            "قائمة انتظار الأغاني فاضية."
                        )
                    ]
                });
            }

            // ==========================================
            // BUILD QUEUE LIST
            // ==========================================

            let description = "";

            if (currentTrack) {
                const title =
                    currentTrack.info?.title ||
                    "عنوان غير معروف";

                const duration = formatDuration(
                    currentTrack.info?.duration
                );

                description +=
                    `**يتم التشغيل الآن**\n` +
                    `🎵 **${title}**\n` +
                    `\`[${duration}]\`\n\n`;
            }

            if (tracks.length > 0) {
                description += "**التالي بالقائمة**\n";

                tracks.forEach((track, index) => {
                    const title =
                        track.info?.title ||
                        "عنوان غير معروف";

                    const duration = formatDuration(
                        track.info?.duration
                    );

                    description +=
                        `\`${index + 1}.\` **${title}** ` +
                        `\`[${duration}]\`\n`;
                });
            } else {
                description +=
                    "**التالي بالقائمة**\n" +
                    "ماكو أغاني بالانتظار حاليًا.";
            }

            // ==========================================
            // LIMIT DISCORD EMBED DESCRIPTION
            // ==========================================

            if (description.length > 4000) {
                description =
                    description.substring(0, 3950) +
                    "\n...وأكثر.";
            }

            // ==========================================
            // QUEUE EMBED
            // ==========================================

            const embed = new EmbedBuilder()
                .setColor("#2a2a2a")
                .setTitle("🎵 قائمة الأغاني")
                .setDescription(description)
                .setFooter({
                    text: `anas Music • ${tracks.length} أغنية بالقائمة`
                });

            await message.channel.send({
                embeds: [embed]
            });

        } catch (error) {
            console.error(
                "❌ Queue command error:",
                error
            );

            await message.reply({
                embeds: [
                    errorEmbed(
                        "صار في خطأ وحنا نجيب قائمة الأغاني."
                    )
                ]
            }).catch(() => {});
        }
    }
};
