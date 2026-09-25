const { EmbedBuilder } = require("discord.js");

function createEmbed(description) {
    return new EmbedBuilder()
        .setColor("#2a2a2a")
        .setDescription(description)
        .setFooter({
            text: "anas Music"
        });
}

module.exports = {
    name: "replay",

    async execute({ client, message }) {
        try {
            const player = client.lavalink.getPlayer(
                message.guild.id
            );

            if (!player) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ ماكو مشغل موسيقى شغال حالياً."
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
                        createEmbed(
                            "❌ لازم تكون بنفس الروم الصوتي مع البوت."
                        )
                    ]
                });
            }

            const track = player.queue.current;

            if (!track) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ ماكو أغنية تشتغل حاليًا."
                        )
                    ]
                });
            }

            const title =
                track.info?.title || "عنوان غير معروف";

            // Restart current song
            await player.seek(0);

            await message.channel.send({
                embeds: [
                    createEmbed(
                        `🔄 عم أعيد **${title}** من البداية.`
                    )
                ]
            });

        } catch (error) {
            console.error(
                "❌ Replay command error:",
                error
            );

            await message.reply({
                embeds: [
                    createEmbed(
                        "❌ صار في خطأ وحنا نعيد الأغنية."
                    )
                ]
            }).catch(() => {});
        }
    }
};

