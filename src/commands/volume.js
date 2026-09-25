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
                            "Ù…Ø§ÙƒÙˆ Ù…Ø´ØºÙ„ Ù…ÙˆØ³ÙŠÙ‚Ù‰ Ø´ØºØ§Ù„ Ø­Ø§Ù„ÙŠÙ‹Ø§."
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
                            "Ù„Ø§Ø²Ù… ØªÙƒÙˆÙ† Ø¨Ø±ÙˆÙ… ØµÙˆØªÙŠ Ø­ØªÙ‰ ØªØ³ØªØ®Ø¯Ù… Ù‡Ø°Ø§ Ø§Ù„Ø£Ù…Ø±."
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
                            "Ù„Ø§Ø²Ù… ØªÙƒÙˆÙ† Ø¨Ù†ÙØ³ Ø§Ù„Ø±ÙˆÙ… Ø§Ù„ØµÙˆØªÙŠ Ù…Ø¹ Ø§Ù„Ø¨ÙˆØª."
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
                                `🔊 Ù…Ø³ØªÙˆÙ‰ Ø§Ù„ØµÙˆØª Ø§Ù„Ø­Ø§Ù„ÙŠ: **${currentVolume}%**`
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
                            "Ø§Ù„Ø±Ø¬Ø§Ø¡ ÙƒØªØ§Ø¨Ø© Ø±Ù‚Ù… ØµØ­ÙŠØ­ Ù„Ù„ØµÙˆØª."
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
                            "Ù…Ø³ØªÙˆÙ‰ Ø§Ù„ØµÙˆØª Ù„Ø§Ø²Ù… ÙŠÙƒÙˆÙ† Ø¨ÙŠÙ† **0** Ùˆ **150**."
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
                    `🔊 ØªÙ… Ø¶Ø¨Ø· Ù…Ø³ØªÙˆÙ‰ Ø§Ù„ØµÙˆØª Ø¹Ù„Ù‰ **${volume}%**.`
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
                        "ØµØ§Ø± ÙÙŠ Ø®Ø·Ø£ ÙˆØ­Ù†Ø§ Ù†ØºÙŠØ± Ù…Ø³ØªÙˆÙ‰ Ø§Ù„ØµÙˆØª."
                    )
                ]
            }).catch(() => {});
        }
    }
};

