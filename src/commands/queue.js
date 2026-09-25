const { EmbedBuilder } = require("discord.js");

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

function errorEmbed(description) {
    return new EmbedBuilder()
        .setColor("#2a2a2a")
        .setDescription(`❌ ${description}`);
}

module.exports = {
    name: "queue",

    async execute({ client, message }) {
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
            // CURRENT TRACK
            // ==========================================

            const currentTrack = player.queue.current;

            // ==========================================
            // QUEUE
            // ==========================================

            const tracks = player.queue.tracks || [];

            if (!currentTrack && tracks.length === 0) {
                return message.reply({
                    embeds: [
                        errorEmbed(
                            "Ù‚Ø§Ø¦Ù…Ø© Ø§Ù†ØªØ¸Ø§Ø± Ø§Ù„Ø£ØºØ§Ù†ÙŠ ÙØ§Ø¶ÙŠØ©."
                        )
                    ]
                });
            }

            // ==========================================
            // BUILD QUEUE LIST
            // ==========================================

            let description = "";

            if (currentTrack) {
                const title =
                    currentTrack.info?.title ||
                    "Ø¹Ù†ÙˆØ§Ù† ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙ";

                const duration = formatDuration(
                    currentTrack.info?.duration
                );

                description +=
                    `**ÙŠØªÙ… Ø§Ù„ØªØ´ØºÙŠÙ„ Ø§Ù„Ø¢Ù†**\n` +
                    `🎵 **${title}**\n` +
                    `\`[${duration}]\`\n\n`;
            }

            if (tracks.length > 0) {
                description += "**Ø§Ù„ØªØ§Ù„ÙŠ Ø¨Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©**\n";

                tracks.forEach((track, index) => {
                    const title =
                        track.info?.title ||
                        "Ø¹Ù†ÙˆØ§Ù† ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙ";

                    const duration = formatDuration(
                        track.info?.duration
                    );

                    description +=
                        `\`${index + 1}.\` **${title}** ` +
                        `\`[${duration}]\`\n`;
                });
            } else {
                description +=
                    "**Ø§Ù„ØªØ§Ù„ÙŠ Ø¨Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©**\n" +
                    "Ù…Ø§ÙƒÙˆ Ø£ØºØ§Ù†ÙŠ Ø¨Ø§Ù„Ø§Ù†ØªØ¸Ø§Ø± Ø­Ø§Ù„ÙŠÙ‹Ø§.";
            }

            // ==========================================
            // LIMIT DISCORD EMBED DESCRIPTION
            // ==========================================

            if (description.length > 4000) {
                description =
                    description.substring(0, 3950) +
                    "\n...ÙˆØ£ÙƒØ«Ø±.";
            }

            // ==========================================
            // QUEUE EMBED
            // ==========================================

            const embed = new EmbedBuilder()
                .setColor("#2a2a2a")
                .setTitle("🎵 Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø£ØºØ§Ù†ÙŠ")
                .setDescription(description)
                .setFooter({
                    text: `anas Music —¢ ${tracks.length} Ø£ØºÙ†ÙŠØ© Ø¨Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©`
                });

            await message.channel.send({
                embeds: [embed]
            });

        } catch (error) {
            console.error(
                "❌ Queue command error:",
                error
            );

            await message.reply({
                embeds: [
                    errorEmbed(
                        "ØµØ§Ø± ÙÙŠ Ø®Ø·Ø£ ÙˆØ­Ù†Ø§ Ù†Ø¬ÙŠØ¨ Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø£ØºØ§Ù†ÙŠ."
                    )
                ]
            }).catch(() => {});
        }
    }
};

