const { EmbedBuilder, ActionRowBuilder, TextInputBuilder, ModalBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, TextInputStyle } = require("discord.js");
const Favorite = require("../models/Favorite");

module.exports = {
    name: "join",

    async execute({ client, message }) {
        try {
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

            let player = client.lavalink.getPlayer(
                message.guild.id
            );

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

            if (!player.connected) {
                await player.connect();
            }

            const user = message.member.user;

            const welcomeEmbed = new EmbedBuilder()
                .setColor("#2a2a2a")
                .setTitle("🎵 أناس للموسيقى")
                .setDescription(
                    `**مرحباً بك ${message.member.user.username}**\n\n` +
                    `✨ اكتب اسم الأغنية أو الرابط في الحقل بالأسفل`
                )
                .setFooter({
                    text: "anas Music"
                })
                .setTimestamp();

            const bannerUrl = client.user?.bannerURL?.({ dynamic: true, size: 1024 });

            if (bannerUrl) {
                welcomeEmbed.setImage(bannerUrl);
            }

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`join_play_${user.id}`)
                    .setLabel("تشغيل أغنية")
                    .setEmoji("🎵")
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId(`join_favorites_${user.id}`)
                    .setLabel("القائمة المفضلة")
                    .setEmoji("❤️")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId(`join_more_${user.id}`)
                    .setLabel("المزيد")
                    .setEmoji("📋")
                    .setStyle(ButtonStyle.Secondary)
            );

            await message.channel.send({
                embeds: [welcomeEmbed],
                components: [row]
            });

        } catch (error) {
            console.error(
                "❌ Join command error:",
                error
            );

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2a2a2a")
                        .setDescription(
                            "❌ صار في خطأ وحنا ننضم للروم الصوتي."
                        )
                ]
            }).catch(() => {});
        }
    }
};
