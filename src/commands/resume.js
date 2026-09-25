const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "resume",

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

            if (!player.paused) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#808080")
                            .setDescription("▶️ الموسيقى تشتغل أصلاً.")
                    ]
                });
            }

            // Resume the current track
            await player.resume();

            const embed = new EmbedBuilder()
                .setColor("#808080")
                .setDescription("▶️ تم استئناف الموسيقى.")
                .setFooter({
                    text: "Yowa Music"
                });

            await message.channel.send({
                embeds: [embed]
            });

        } catch (error) {
            console.error("❌ Resume command error:", error);

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#808080")
                        .setDescription(
                            "❌ صار في خطأ وحنا نستأنف الموسيقى."
                        )
                ]
            }).catch(() => {});
        }
    }
};
