const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

function formatDuration(ms) {
    if (!ms || ms < 0) return "00:00";

    const totalSeconds = Math.floor(ms / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

module.exports = {
    name: "trackStart",

    async execute(client, player, track) {
        try {
            const channel = client.channels.cache.get(
                player.textChannelId
            );

            if (!channel) return;

            const title =
                track.info?.title || "عنوان غير معروف";

            const author =
                track.info?.author || "فنان غير معروف";

            const duration =
                formatDuration(track.info?.duration);

            const artwork =
                track.info?.artworkUrl ||
                track.info?.thumbnail ||
                null;

            // Get the player's actual current volume
            const volume = player.volume ?? 75;

            const embed = new EmbedBuilder()
                .setColor("#808080")
                .setTitle(title)
                .setDescription(
                    `**${author}**\n\n` +
                    `طلبها: ${
                        track.requester
                            ? track.requester
                            : "غير معروف"
                    }\n` +
                    `المدة: **${duration}** • الصوت: **${volume}%**`
                )
                .setFooter({
                    text: "Yowa Music"
                });

            if (artwork) {
                embed.setImage(artwork);
            }

            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("music_previous")
                    .setEmoji("⏮️")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("music_pause")
                    .setEmoji("⏸️")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("music_skip")
                    .setEmoji("⏭️")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("music_stop")
                    .setEmoji("⏹️")
                    .setStyle(ButtonStyle.Secondary)
            );

            await channel.send({
                content: `🎵 تشتغل الآن **${title}**`,
                embeds: [embed],
                components: [buttons]
            });

        } catch (error) {
            console.error(
                "❌ TrackStart event error:",
                error
            );
        }
    }
};
