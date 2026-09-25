const { EmbedBuilder } = require("discord.js");
const { addHistory } = require("../utils/musicHistory");

module.exports = {
    name: "skip",

    async execute({ client, message }) {
        try {
            const player = client.lavalink.getPlayer(message.guild.id);

            if (!player) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#2a2a2a")
                            .setDescription(
                                "❌ ماكو مشغل موسيقى شغال حالياً."
                            )
                    ]
                });
            }

            const voiceChannel = message.member?.voice?.channel;

            if (!voiceChannel) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#2a2a2a")
                            .setDescription(
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
                        new EmbedBuilder()
                            .setColor("#2a2a2a")
                            .setDescription(
                                "❌ لازم تكون بنفس الروم الصوتي مع البوت."
                            )
                    ]
                });
            }

            const currentTrack = player.queue.current;

            if (!currentTrack) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#2a2a2a")
                            .setDescription(
                                "❌ ماكو أغنية تشتغل."
                            )
                    ]
                });
            }

            const skippedTitle =
                currentTrack.info?.title || "المقطع الحالي";

            // ==========================================
            // SAVE CURRENT TRACK TO HISTORY
            // ==========================================

            addHistory(
                message.guild.id,
                currentTrack
            );

            // ==========================================
            // SKIP
            // ==========================================

            await player.skip();

            // ==========================================
            // RESPONSE
            // ==========================================

            const embed = new EmbedBuilder()
                .setColor("#2a2a2a")
                .setDescription(
                    `⏭️ تم تخطي **${skippedTitle}**.`
                )
                .setFooter({
                    text: "anas Music"
                });

            await message.channel.send({
                embeds: [embed]
            });

        } catch (error) {
            console.error(
                "❌ Skip command error:",
                error
            );

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2a2a2a")
                        .setDescription(
                            "❌ صار في خطأ وحنا نتخطى الأغنية."
                        )
                ]
            }).catch(() => {});
        }
    }
};

