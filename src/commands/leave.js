const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "leave",

    async execute({ client, message }) {
        try {
            const player = client.lavalink.getPlayer(
                message.guild.id
            );

            if (!player || !player.connected) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#808080")
                            .setDescription(
                                "❌ أنا مو متصل بروم صوتي."
                            )
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
            // 24/7 CHECK
            // ==========================================

            const is247 =
                player.getData("247") === true;

            if (is247) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#808080")
                            .setDescription(
                                "🔒 **وضع 24/7 مفعّل.**\n\nما أقدر أطلع من الروم الصوتي وهو شغال."
                            )
                            .setFooter({
                                text: "Yowa Music"
                            })
                    ]
                });
            }

            // ==========================================
            // MARK MANUAL LEAVE
            // ==========================================

            player.setData("manualLeave", true);

            // ==========================================
            // STOP MUSIC
            // ==========================================

            if (player.playing || player.paused) {
                await player.stopPlaying();
            }

            // ==========================================
            // CLEAR QUEUE
            // ==========================================

            if (
                player.queue &&
                typeof player.queue.clear === "function"
            ) {
                player.queue.clear();
            }

            // ==========================================
            // DISCONNECT
            // ==========================================

            await player.disconnect();

            // ==========================================
            // SUCCESS MESSAGE
            // ==========================================

            const embed = new EmbedBuilder()
                .setColor("#808080")
                .setTitle("👋 تم قطع الاتصال")
                .setDescription(
                    "طلعت من الروم الصوتي وفرّغت قائمة الأغاني."
                )
                .setFooter({
                    text: "Yowa Music"
                });

            await message.channel.send({
                embeds: [embed]
            });

        } catch (error) {
            console.error(
                "❌ Leave command error:",
                error
            );

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#808080")
                        .setDescription(
                            "❌ صار في خطأ وحنا نطلع من الروم الصوتي."
                        )
                ]
            }).catch(() => {});
        }
    }
};
