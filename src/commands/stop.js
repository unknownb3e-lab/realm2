const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "stop",

    async execute({ client, message }) {
        try {
            const player = client.lavalink.getPlayer(message.guild.id);

            if (!player) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#808080")
                            .setDescription("❌ ماكو مشغل موسيقى شغال حاليًا.")
                    ]
                });
            }

            const voiceChannel = message.member?.voice?.channel;

            if (!voiceChannel) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#808080")
                            .setDescription(
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
                        new EmbedBuilder()
                            .setColor("#808080")
                            .setDescription(
                                "❌ لازم تكون بنفس الروم الصوتي مع البوت."
                            )
                    ]
                });
            }

            // ==========================================
            // CHECK 24/7
            // ==========================================

            const is247 = player.getData("247") === true;

            // ==========================================
            // STOP MUSIC
            // ==========================================

            await player.stopPlaying();

            // ==========================================
            // CLEAR QUEUE
            // ==========================================

            if (player.queue?.tracks) {
                while (player.queue.tracks.length > 0) {
                    player.queue.remove(0);
                }
            }

            // ==========================================
            // DISCONNECT ONLY IF 24/7 IS OFF
            // ==========================================

            if (!is247) {
                await player.disconnect();
            }

            // ==========================================
            // RESPONSE
            // ==========================================

            const embed = new EmbedBuilder()
                .setColor("#808080")
                .setDescription(
                    is247
                        ? "⏹️ تم إيقاف الموسيقى وتفريغ القائمة.\n🔒 **وضع 24/7 مفعّل، فرح أضل بالروم الصوتي.**"
                        : "⏹️ تم إيقاف الموسيقى وتفريغ القائمة."
                )
                .setFooter({
                    text: "Yowa Music"
                });

            await message.channel.send({
                embeds: [embed]
            });

        } catch (error) {
            console.error("❌ Stop command error:", error);

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#808080")
                        .setDescription(
                            "❌ صار في خطأ وحنا نوقف الموسيقى."
                        )
                ]
            }).catch(() => {});
        }
    }
};
