const { EmbedBuilder } = require("discord.js");

function errorEmbed(description) {
    return new EmbedBuilder()
        .setColor("#2a2a2a")
        .setDescription(`❌ ${description}`);
}

module.exports = {
    name: "loop",

    async execute({ client, message, args }) {
        try {
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

            const mode = args[0]?.toLowerCase();

            // ==========================================
            // SHOW CURRENT MODE
            // ==========================================

            if (!mode) {
                const currentMode =
                    player.repeatMode || "off";

                const displayMode =
                    currentMode === "track"
                        ? "Ø§Ù„Ø£ØºÙ†ÙŠØ©"
                        : currentMode === "queue"
                        ? "Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©"
                        : "Ù…ØªÙˆÙ‚Ù";

                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#2a2a2a")
                            .setDescription(
                                `🔁 ÙˆØ¶Ø¹ Ø§Ù„ØªÙƒØ±Ø§Ø± Ø§Ù„Ø­Ø§Ù„ÙŠ: **${displayMode}**\n\n` +
                                `Ø§Ø³ØªØ®Ø¯Ù… \`>loop off\`✅ \`>loop song\` Ø£Ùˆ \`>loop queue\`.`
                            )
                            .setFooter({
                                text: "anas Music"
                            })
                    ]
                });
            }

            // ==========================================
            // CONVERT USER INPUT
            // ==========================================

            let repeatMode;

            if (mode === "off") {
                repeatMode = "off";
            } else if (
                mode === "song" ||
                mode === "track"
            ) {
                repeatMode = "track";
            } else if (mode === "queue") {
                repeatMode = "queue";
            } else {
                return message.reply({
                    embeds: [
                        errorEmbed(
                            "ÙˆØ¶Ø¹ ØªÙƒØ±Ø§Ø± ØºÙŠØ± ØµØ­ÙŠØ­.\n\nØ§Ø³ØªØ®Ø¯Ù… `>loop off`✅ `>loop song` Ø£Ùˆ `>loop queue`."
                        )
                    ]
                });
            }

            // ==========================================
            // SET REPEAT MODE
            // ==========================================

            await player.setRepeatMode(repeatMode);

            // ==========================================
            // SUCCESS MESSAGE
            // ==========================================

            let description;

            if (repeatMode === "off") {
                description = "🔁 ØªÙ… Ø¥ÙŠÙ‚Ø§Ù Ø§Ù„ØªÙƒØ±Ø§Ø±.";
            } else if (repeatMode === "track") {
                description = "🔂 Ø§Ù„Ø£ØºÙ†ÙŠØ© Ø§Ù„Ø­Ø§Ù„ÙŠØ© Ø±Ø­ ØªØªÙƒØ±Ø±.";
            } else {
                description = "🔁 Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ø±Ø­ ØªØªÙƒØ±Ø±.";
            }

            const embed = new EmbedBuilder()
                .setColor("#2a2a2a")
                .setDescription(description)
                .setFooter({
                    text: "anas Music"
                });

            await message.channel.send({
                embeds: [embed]
            });

        } catch (error) {
            console.error(
                "❌ Loop command error:",
                error
            );

            await message.reply({
                embeds: [
                    errorEmbed(
                        "ØµØ§Ø± ÙÙŠ Ø®Ø·Ø£ ÙˆØ­Ù†Ø§ Ù†ØºÙŠØ± ÙˆØ¶Ø¹ Ø§Ù„ØªÙƒØ±Ø§Ø±."
                    )
                ]
            }).catch(() => {});
        }
    }
};

