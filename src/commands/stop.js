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
                            .setColor("#2a2a2a")
                            .setDescription("❌ ماكو مشغل موسيقى شغال حالياً.")
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
                .setColor("#2a2a2a")
                .setDescription(
                    is247
                        ? "⏹️ تم إيقاف الموسيقى وتفريغ القائمة.\n🔒 **وضع 24/7 مفعل.\n\nفرح أضل بالروم الصوتي.**"
                        : "⏹️ تم إيقاف الموسيقى وتفريغ القائمة."
                )
                .setFooter({
                    text: "anas Music"
                });

            await message.channel.send({
                embeds: [embed]
            });

        } catch (error) {
            console.error("❌ Stop command error:", error);

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2a2a2a")
                        .setDescription(
                            "❌ صار في خطأ وحنا نوقف الموسيقى."
                        )
                ]
            }).catch(() => {});
        }
    }
};
