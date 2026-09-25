const { EmbedBuilder } = require("discord.js");

function errorEmbed(description) {
    return new EmbedBuilder()
        .setColor("#2a2a2a")
        .setDescription(`❌ ${description}`);
}

module.exports = {
    name: "volume",

    async execute({ client, message, args }) {
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
            // VOICE CHANNEL CHECK
            // ==========================================

            const voiceChannel = message.member?.voice?.channel;

            if (!voiceChannel) {
                return message.reply({
                    embeds: [
                        errorEmbed(
                            "لازم تكون بروم صوتي حتى تستخدم هاذا الأمر."
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
                        errorEmbed(
                            "لازم تكون بنفس الروم الصوتي مع البوت."
                        )
                    ]
                });
            }

            // ==========================================
            // SHOW CURRENT VOLUME
            // ==========================================

            if (!args.length) {
                const currentVolume = player.volume ?? 75;

                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#2a2a2a")
                            .setDescription(
                                `🔊 مستوى الصوت الحالي: **${currentVolume}%**`
                            )
                            .setFooter({
                                text: "anas Music"
                            })
                    ]
                });
            }

            // ==========================================
            // PARSE VOLUME
            // ==========================================

            const volume = Number(args[0]);

            if (!Number.isInteger(volume)) {
                return message.reply({
                    embeds: [
                        errorEmbed(
                            "الرجاء كتابة رقم صحيح للصوت."
                        )
                    ]
                });
            }

            // ==========================================
            // RANGE CHECK
            // ==========================================

            if (volume < 0 || volume > 150) {
                return message.reply({
                    embeds: [
                        errorEmbed(
                            "مستوى الصوت لازم يكون بين **0** و **150**."
                        )
                    ]
                });
            }

            // ==========================================
            // SET VOLUME
            // ==========================================

            await player.setVolume(volume);

            // ==========================================
            // SUCCESS
            // ==========================================

            const embed = new EmbedBuilder()
                .setColor("#2a2a2a")
                .setDescription(
                    `🔊 تم ضبط مستوى الصوت على **${volume}%**.`
                )
                .setFooter({
                    text: "anas Music"
                });

            await message.channel.send({
                embeds: [embed]
            });

        } catch (error) {
            console.error(
                "❌ Volume command error:",
                error
            );

            await message.reply({
                embeds: [
                    errorEmbed(
                        "صار في خطأ وحنا نغير مستوى الصوت."
                    )
                ]
            }).catch(() => {});
        }
    }
};
