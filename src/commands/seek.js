const { EmbedBuilder } = require("discord.js");

function createEmbed(description) {
    return new EmbedBuilder()
        .setColor("#808080")
        .setDescription(description)
        .setFooter({
            text: "Yowa Music"
        });
}

function parseTime(input) {
    if (!input) return null;

    // Seconds: 90
    if (/^\d+$/.test(input)) {
        return Number(input) * 1000;
    }

    // MM:SS or HH:MM:SS
    const parts = input.split(":").map(Number);

    if (parts.some(Number.isNaN)) {
        return null;
    }

    if (parts.length === 2) {
        const [minutes, seconds] = parts;

        if (seconds >= 60) return null;

        return (minutes * 60 + seconds) * 1000;
    }

    if (parts.length === 3) {
        const [hours, minutes, seconds] = parts;

        if (minutes >= 60 || seconds >= 60) return null;

        return (
            (hours * 3600 +
                minutes * 60 +
                seconds) *
            1000
        );
    }

    return null;
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(
        (totalSeconds % 3600) / 60
    );
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

module.exports = {
    name: "seek",

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

            const currentTrack =
                player.queue.current;

            if (!currentTrack) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ ماكو أغنية تشتغل حاليًا."
                        )
                    ]
                });
            }

            if (!args.length) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ الرجاء كتابة الوقت.\n\n" +
                            "أمثلة:\n" +
                            "`>seek 90`\n" +
                            "`>seek 1:30`\n" +
                            "`>seek 1:30:00`"
                        )
                    ]
                });
            }

            const position = parseTime(args[0]);

            if (position === null) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ صيغة الوقت غير صحيحة."
                        )
                    ]
                });
            }

            const duration =
                currentTrack.info?.duration || 0;

            if (position >= duration) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            `❌ هاي المدة أطول من مدة الأغنية (**${formatTime(duration)}**).`
                        )
                    ]
                });
            }

            await player.seek(position);

            await message.channel.send({
                embeds: [
                    createEmbed(
                        `⏩ تم الانتقال إلى **${formatTime(position)}**.`
                    )
                ]
            });

        } catch (error) {
            console.error(
                "❌ Seek command error:",
                error
            );

            await message.reply({
                embeds: [
                    createEmbed(
                        "❌ صار في خطأ وحنا ننتقل بالأغنية."
                    )
                ]
            }).catch(() => {});
        }
    }
};
