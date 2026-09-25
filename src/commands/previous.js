const { EmbedBuilder } = require("discord.js");

const {
    addHistory,
    getPrevious
} = require("../utils/musicHistory");

function errorEmbed(description) {
    return new EmbedBuilder()
        .setColor("#2a2a2a")
        .setDescription(`❌ ${description}`);
}

module.exports = {
    name: "previous",

    async execute({ client, message }) {
        try {
            // ==========================================
            // VOICE CHANNEL
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

            // ==========================================
            // PLAYER
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
            // SAME VOICE CHANNEL
            // ==========================================

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
            // GET PREVIOUS
            // ==========================================

            const previousTrack = getPrevious(
                message.guild.id
            );

            if (!previousTrack) {
                return message.reply({
                    embeds: [
                        errorEmbed(
                            "Ù…Ø§ÙƒÙˆ Ø£ØºÙ†ÙŠØ© Ø³Ø§Ø¨Ù‚Ø©."
                        )
                    ]
                });
            }

            // ==========================================
            // SAVE CURRENT TO HISTORY
            // ==========================================

            const currentTrack = player.queue.current;

            if (currentTrack) {
                addHistory(
                    message.guild.id,
                    currentTrack
                );
            }

            // ==========================================
            // STOP WITHOUT CLEARING QUEUE
            // ==========================================

            await player.stopPlaying(false, false);

            // ==========================================
            // PLAY PREVIOUS DIRECTLY
            // ==========================================

            await player.play({
                track: {
                    encoded: previousTrack.info?.encoded,
                    identifier: previousTrack.info?.identifier
                },
                clientTrack: previousTrack
            });

            // ==========================================
            // RESPONSE
            // ==========================================

            const title =
                previousTrack.info?.title ||
                "Ø¹Ù†ÙˆØ§Ù† ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙ";

            await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2a2a2a")
                        .setDescription(
                            `⏮️ Ø¹Ù… ØªØ´ØªØºÙ„ Ø§Ù„Ø£ØºÙ†ÙŠØ© Ø§Ù„Ø³Ø§Ø¨Ù‚Ø©: **${title}**`
                        )
                        .setFooter({
                            text: "anas Music"
                        })
                ]
            });

        } catch (error) {
            console.error(
                "❌ Previous command error:",
                error
            );

            await message.reply({
                embeds: [
                    errorEmbed(
                        "ØµØ§Ø± ÙÙŠ Ø®Ø·Ø£ ÙˆØ­Ù†Ø§ Ù†Ø´ØºÙ„ Ø§Ù„Ø£ØºÙ†ÙŠØ© Ø§Ù„Ø³Ø§Ø¨Ù‚Ø©."
                    )
                ]
            }).catch(() => {});
        }
    }
};

