const { EmbedBuilder } = require("discord.js");

const {
    addHistory,
    getPrevious
} = require("../utils/musicHistory");

function errorEmbed(description) {
    return new EmbedBuilder()
        .setColor("#2a2a2a")
        .setDescription(`❌ ${description}`);
}

module.exports = {
    name: "previous",

    async execute({ client, message }) {
        try {
            // ==========================================
            // VOICE CHANNEL
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

            // ==========================================
            // PLAYER
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
            // SAME VOICE CHANNEL
            // ==========================================

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
            // GET PREVIOUS
            // ==========================================

            const previousTrack = getPrevious(
                message.guild.id
            );

            if (!previousTrack) {
                return message.reply({
                    embeds: [
                        errorEmbed(
                            "ماكو أغنية سابقة."
                        )
                    ]
                });
            }

            // ==========================================
            // SAVE CURRENT TO HISTORY
            // ==========================================

            const currentTrack = player.queue.current;

            if (currentTrack) {
                addHistory(
                    message.guild.id,
                    currentTrack
                );
            }

            // ==========================================
            // STOP WITHOUT CLEARING QUEUE
            // ==========================================

            await player.stopPlaying(false, false);

            // ==========================================
            // PLAY PREVIOUS DIRECTLY
            // ==========================================

            await player.play({
                track: {
                    encoded: previousTrack.info?.encoded,
                    identifier: previousTrack.info?.identifier
                },
                clientTrack: previousTrack
            });

            // ==========================================
            // RESPONSE
            // ==========================================

            const title =
                previousTrack.info?.title ||
                "عنوان غير معروف";

            await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2a2a2a")
                        .setDescription(
                            `⏮️ عم تشتغل الأغنية السابقة: **${title}**`
                        )
                        .setFooter({
                            text: "anas Music"
                        })
                ]
            });

        } catch (error) {
            console.error(
                "❌ Previous command error:",
                error
            );

            await message.reply({
                embeds: [
                    errorEmbed(
                        "صار في خطأ وحنا نشغل الأغنية السابقة."
                    )
                ]
            }).catch(() => {});
        }
    }
};
