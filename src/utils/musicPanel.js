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

function createMusicPanel(track) {
    const title = track.info?.title || "عنوان غير معروف";
    const author = track.info?.author || "فنان غير معروف";
    const duration = formatDuration(track.info?.duration);

    const artwork =
        track.info?.artworkUrl ||
        track.info?.thumbnail ||
        null;

    const embed = new EmbedBuilder()
        .setColor("#2a2a2a")
        .setTitle(title)
        .setDescription(
            `**${author}**\n\n` +
            `طلبها: ${track.requester || "غير معروف"}\n` +
            `المدة: **${duration}** —¢ اللصوت: **75%**`
        )
        .setFooter({
            text: "anas Music"
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

    return {
        embed,
        buttons
    };
}

module.exports = {
    createMusicPanel
};

