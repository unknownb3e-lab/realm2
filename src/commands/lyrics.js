const { EmbedBuilder } = require("discord.js");
const { getLyrics } = require("genius-lyrics-api");

module.exports = {
    name: "lyrics",

    async execute({ client, message, args }) {
        try {
            const player = client.lavalink.getPlayer(
                message.guild.id
            );

            if (!player) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#808080")
                            .setDescription(
                                "❌ Ù…Ø§ÙƒÙˆ Ù…Ø´ØºÙ„ Ù…ÙˆØ³ÙŠÙ‚Ù‰ Ø´ØºØ§Ù„ Ø­Ø§Ù„ÙŠÙ‹Ø§."
                            )
                    ]
                });
            }

            const track = player.queue.current;

            if (!track) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#808080")
                            .setDescription(
                                "❌ Ù…Ø§ÙƒÙˆ Ø£ØºÙ†ÙŠØ© ØªØ´ØªØºÙ„ Ø­Ø§Ù„ÙŠÙ‹Ø§."
                            )
                    ]
                });
            }

            const title =
                track.info?.title || "";

            const artist =
                track.info?.author || "";

            if (!title) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#808080")
                            .setDescription(
                                "❌ Ù…Ø§ Ù‚Ø¯Ø±Øª Ø£Ø­Ø¯Ø¯ Ø§Ù„Ø£ØºÙ†ÙŠØ© Ø§Ù„Ø­Ø§Ù„ÙŠØ©."
                            )
                    ]
                });
            }

            // ==========================================
            // SEARCH LYRICS
            // ==========================================

            const lyrics = await getLyrics({
                apiKey: process.env.GENIUS_API_KEY,
                title: title,
                artist: artist
            });

            if (!lyrics) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#808080")
                            .setTitle(title)
                            .setDescription(
                                `❌ Ù…Ø§ Ù„Ù‚ÙŠØª ÙƒÙ„Ù…Ø§Øª Ù„Ù€ **${title}**.`
                            )
                            .setFooter({
                                text: "anas Music"
                            })
                    ]
                });
            }

            // ==========================================
            // DISCORD MESSAGE LIMIT
            // ==========================================

            const maxLength = 3900;

            let lyricsText = lyrics;

            if (lyricsText.length > maxLength) {
                lyricsText =
                    lyricsText.substring(0, maxLength) +
                    "\n\n... ØªÙ… Ø§Ø®ØªØµØ§Ø± Ø§Ù„ÙƒÙ„Ù…Ø§Øª.";
            }

            const embed = new EmbedBuilder()
                .setColor("#808080")
                .setTitle(`🎵 ${title}`)
                .setDescription(
                    `**${artist}**\n\n${lyricsText}`
                )
                .setFooter({
                    text: "anas Music —¢ Ø§Ù„ÙƒÙ„Ù…Ø§Øª"
                });

            await message.channel.send({
                embeds: [embed]
            });

        } catch (error) {
            console.error(
                "❌ Lyrics command error:",
                error
            );

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#808080")
                        .setDescription(
                            "❌ ØµØ§Ø± ÙÙŠ Ø®Ø·Ø£ ÙˆØ­Ù†Ø§ Ù†Ø¬ÙŠØ¨ Ø§Ù„ÙƒÙ„Ù…Ø§Øª."
                        )
                ]
            }).catch(() => {});
        }
    }
};

