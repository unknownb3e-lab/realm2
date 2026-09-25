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
                                "❌ ماكو مشغل موسيقى شغال حاليًا."
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
                                "❌ ماكو أغنية تشتغل حاليًا."
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
                                "❌ ما قدرت أحدد الأغنية الحالية."
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
                                `❌ ما لقيت كلمات لـ **${title}**.`
                            )
                            .setFooter({
                                text: "Yowa Music"
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
                    "\n\n... تم اختصار الكلمات.";
            }

            const embed = new EmbedBuilder()
                .setColor("#808080")
                .setTitle(`🎵 ${title}`)
                .setDescription(
                    `**${artist}**\n\n${lyricsText}`
                )
                .setFooter({
                    text: "Yowa Music • الكلمات"
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
                            "❌ صار في خطأ وحنا نجيب الكلمات."
                        )
                ]
            }).catch(() => {});
        }
    }
};
