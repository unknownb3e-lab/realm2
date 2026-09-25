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

function createProgressBar(position, duration) {
    if (!duration || duration <= 0) {
        return "━━━━━━━━━━━━━━━━━━━━";
    }

    const progress = Math.min(position / duration, 1);
    const totalBlocks = 20;
    const currentBlock = Math.floor(progress * totalBlocks);

    return (
        "▬".repeat(Math.max(0, currentBlock)) +
        "🔘" +
        "▬".repeat(Math.max(0, totalBlocks - currentBlock))
    );
}

module.exports = {
    name: "nowplaying",

    async execute({ client, message }) {
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

            const info = track.info || {};

            const title =
                info.title || "Ø¹Ù†ÙˆØ§Ù† ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙ";

            const author =
                info.author || "ÙÙ†Ø§Ù† ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙ";

            const durationMs =
                info.duration || 0;

            const positionMs =
                player.position || 0;

            const duration =
                formatDuration(durationMs);

            const position =
                formatDuration(positionMs);

            const volume =
                player.volume ?? 75;

            const status =
                player.paused
                    ? "⏸️ Ù…ØªÙˆÙ‚ÙØ© Ù…Ø¤Ù‚ØªÙ‹Ø§"
                    : "▶️ ØªØ´ØªØºÙ„";

            const requester =
                track.requester
                    ? track.requester.toString()
                    : "ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙ";

            const progressBar =
                createProgressBar(
                    positionMs,
                    durationMs
                );

            const artwork =
                info.artworkUrl ||
                info.thumbnail ||
                null;

            const embed = new EmbedBuilder()
                .setColor("#808080")
                .setTitle(`🎵 ${title}`)
                .setDescription(
                    `**${author}**\n\n` +
                    `${status}\n\n` +
                    `${progressBar}\n` +
                    `\`${position} / ${duration}\`\n\n` +
                    `🔊 Ø§Ù„ØµÙˆØª: **${volume}%**\n` +
                    `👤 Ø·Ù„Ø¨Ù‡Ø§: ${requester}`
                )
                .setFooter({
                    text: "anas Music —¢ ØªØ´ØªØºÙ„ Ø§Ù„Ø¢Ù†"
                });

            if (artwork) {
                embed.setImage(artwork);
            }

            const buttons =
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("music_previous")
                        .setEmoji("⏮️")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("music_pause")
                        .setEmoji(
                            player.paused
                                ? "▶️"
                                : "⏸️"
                        )
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

            await message.channel.send({
                embeds: [embed],
                components: [buttons]
            });

        } catch (error) {
            console.error(
                "❌ Now Playing command error:",
                error
            );

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#808080")
                        .setDescription(
                            "❌ ØµØ§Ø± ÙÙŠ Ø®Ø·Ø£ ÙˆØ­Ù†Ø§ Ù†Ø¬ÙŠØ¨ Ø§Ù„Ø£ØºÙ†ÙŠØ© Ø§Ù„Ø­Ø§Ù„ÙŠØ©."
                        )
                ]
            }).catch(() => {});
        }
    }
};

