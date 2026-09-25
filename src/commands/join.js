const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "join",

    async execute({ client, message }) {
        try {
            const voiceChannel = message.member?.voice?.channel;

            // ==========================================
            // VOICE CHANNEL CHECK
            // ==========================================

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

            // ==========================================
            // GET EXISTING PLAYER
            // ==========================================

            let player = client.lavalink.getPlayer(
                message.guild.id
            );

            // ==========================================
            // BOT ALREADY IN VC
            // ==========================================

            if (player?.connected && player.voiceChannelId) {
                if (player.voiceChannelId === voiceChannel.id) {
                    return message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("#808080")
                                .setDescription(
                                    `✅ أنا متصل بـ <#${voiceChannel.id}> أصلاً.`
                                )
                        ]
                    });
                }

                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#808080")
                            .setDescription(
                                `❌ أنا متصل بـ <#${player.voiceChannelId}> حاليًا.`
                            )
                    ]
                });
            }

            // ==========================================
            // CREATE PLAYER
            // ==========================================

            if (!player) {
                player = client.lavalink.createPlayer({
                    guildId: message.guild.id,
                    voiceChannelId: voiceChannel.id,
                    textChannelId: message.channel.id,

                    selfDeaf: true,
                    selfMute: false,

                    volume: 75
                });
            } else {
                player.voiceChannelId = voiceChannel.id;
                player.textChannelId = message.channel.id;
            }

            // ==========================================
            // CONNECT
            // ==========================================

            if (!player.connected) {
                await player.connect();
            }

            // ==========================================
            // SUCCESS
            // ==========================================

            const embed = new EmbedBuilder()
                .setColor("#808080")
                .setTitle("🔊 تم الاتصال")
                .setDescription(
                    `انضممت لـ <#${voiceChannel.id}> بنجاح.`
                )
                .setFooter({
                    text: "Yowa Music"
                });

            await message.channel.send({
                embeds: [embed]
            });

        } catch (error) {
            console.error("❌ Join command error:", error);

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#808080")
                        .setDescription(
                            "❌ صار في خطأ وحنا ننضم للروم الصوتي."
                        )
                ]
            }).catch(() => {});
        }
    }
};
