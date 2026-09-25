const { EmbedBuilder } = require("discord.js");

function createEmbed(description) {
    return new EmbedBuilder()
        .setColor("#2a2a2a")
        .setDescription(description)
        .setFooter({
            text: "anas Music"
        });
}

module.exports = {
    name: "remove",

    async execute({ client, message, args }) {
        try {
            const player = client.lavalink.getPlayer(
                message.guild.id
            );

            if (!player) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ Ù…Ø§ÙƒÙˆ Ù…Ø´ØºÙ„ Ù…ÙˆØ³ÙŠÙ‚Ù‰ Ø´ØºØ§Ù„ Ø­Ø§Ù„ÙŠÙ‹Ø§."
                        )
                    ]
                });
            }

            const voiceChannel =
                message.member?.voice?.channel;

            if (!voiceChannel) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ Ù„Ø§Ø²Ù… ØªÙƒÙˆÙ† Ø¨Ø±ÙˆÙ… ØµÙˆØªÙŠ Ø­ØªÙ‰ ØªØ³ØªØ®Ø¯Ù… Ù‡Ø°Ø§ Ø§Ù„Ø£Ù…Ø±."
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
                        createEmbed(
                            "❌ Ù„Ø§Ø²Ù… ØªÙƒÙˆÙ† Ø¨Ù†ÙØ³ Ø§Ù„Ø±ÙˆÙ… Ø§Ù„ØµÙˆØªÙŠ Ù…Ø¹ Ø§Ù„Ø¨ÙˆØª."
                        )
                    ]
                });
            }

            // ==========================================
            // ARGUMENT CHECK
            // ==========================================

            if (
                args.length < 2 ||
                args[0].toLowerCase() !== "queue"
            ) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ Ø§Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù…: `>remove queue <Ø±Ù‚Ù…>`\n\nÙ…Ø«Ø§Ù„: `>remove queue 2`"
                        )
                    ]
                });
            }

            const position = Number(args[1]);

            if (!Number.isInteger(position) || position < 1) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ Ø§Ù„Ø±Ø¬Ø§Ø¡ ÙƒØªØ§Ø¨Ø© Ø±Ù‚Ù… ØµØ­ÙŠØ­ Ø¨Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©."
                        )
                    ]
                });
            }

            // ==========================================
            // GET QUEUE
            // ==========================================

            const queue = player.queue;

            if (!queue || !queue.tracks) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© ÙØ§Ø¶ÙŠØ©."
                        )
                    ]
                });
            }

            if (position > queue.tracks.length) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            `❌ Ù…Ø§ÙƒÙˆ Ø£ØºÙ†ÙŠØ© Ø¨Ø§Ù„Ø±Ù‚Ù… **${position}** Ø¨Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©.`
                        )
                    ]
                });
            }

            // ==========================================
            // GET TRACK
            // ==========================================

            const track = queue.tracks[position - 1];

            const title =
                track?.info?.title || "Ø¹Ù†ÙˆØ§Ù† ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙ";

            // ==========================================
            // REMOVE TRACK
            // ==========================================

            queue.remove(position - 1);

            // ==========================================
            // SUCCESS
            // ==========================================

            await message.channel.send({
                embeds: [
                    createEmbed(
                        `🗑️ ØªÙ… Ø­Ø°Ù **${title}** Ù…Ù† Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©.`
                    )
                ]
            });

        } catch (error) {
            console.error(
                "❌ Remove command error:",
                error
            );

            await message.reply({
                embeds: [
                    createEmbed(
                        "❌ ØµØ§Ø± ÙÙŠ Ø®Ø·Ø£ ÙˆØ­Ù†Ø§ Ù†Ø­Ø°Ù Ù‡Ø§ÙŠ Ø§Ù„Ø£ØºÙ†ÙŠØ©."
                    )
                ]
            }).catch(() => {});
        }
    }
};

