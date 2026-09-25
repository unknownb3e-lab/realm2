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
    name: "filter",

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

            if (!player.queue.current) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ Ù…Ø§ÙƒÙˆ Ø£ØºÙ†ÙŠØ© ØªØ´ØªØºÙ„ Ø­Ø§Ù„ÙŠÙ‹Ø§."
                        )
                    ]
                });
            }

            const filter = args
                .join("")
                .toLowerCase();

            if (!filter) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ Ø§Ù„Ø±Ø¬Ø§Ø¡ ÙƒØªØ§Ø¨Ø© Ø§Ø³Ù… Ø§Ù„ÙÙ„ØªØ±.\n\nÙ…Ø«Ø§Ù„: `>filter bassboost`"
                        )
                    ]
                });
            }

            const filterManager =
                player.filterManager;

            if (!filterManager) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ Ø§Ù„ÙÙ„Ø§ØªØ± Ù…Ùˆ Ù…ØªÙˆÙØ±Ø© Ø¨Ù‡Ø°Ø§ Ø§Ù„Ù…Ø´ØºÙ„."
                        )
                    ]
                });
            }

            // ==========================================
            // NORMAL / RESET
            // ==========================================

            if (
                filter === "normal" ||
                filter === "reset" ||
                filter === "off"
            ) {
                await filterManager.resetFilters();

                return message.channel.send({
                    embeds: [
                        createEmbed(
                            "🎛️ **ØªÙ…Øª Ø¥Ø¹Ø§Ø¯Ø© Ø¶Ø¨Ø· Ø§Ù„ÙÙ„Ø§ØªØ±!**\n\nØ±Ø¬Ø¹Øª Ø§Ù„Ø£ØºÙ†ÙŠØ© Ù„ÙˆØ¶Ø¹Ù‡Ø§ Ø§Ù„Ø·Ø¨ÙŠØ¹ÙŠ."
                        )
                    ]
                });
            }

            // ==========================================
            // BASSBOOST
            // ==========================================

            if (
                filter === "bassboost" ||
                filter === "bass"
            ) {
                await filterManager.resetFilters();

                filterManager.equalizerBands = [
                    { band: 0, gain: 0.35 },
                    { band: 1, gain: 0.30 },
                    { band: 2, gain: 0.25 },
                    { band: 3, gain: 0.20 },
                    { band: 4, gain: 0.15 }
                ];

                filterManager.filters.equalizer = true;

                await filterManager.applyPlayerFilters();

                return message.channel.send({
                    embeds: [
                        createEmbed(
                            "🔊 **ØªÙ… ØªÙØ¹ÙŠÙ„ ØªØ¹Ø²ÙŠØ² Ø§Ù„Ø¨Ø§Øµ!**\n\nØµØ§Ø± Ø§Ù„Ø¨Ø§Øµ Ø£Ù‚ÙˆÙ‰."
                        )
                    ]
                });
            }

            // ==========================================
            // NIGHTCORE
            // ==========================================

            if (filter === "nightcore") {
                await filterManager.resetFilters();

                filterManager.data.timescale = {
                    speed: 1.25,
                    pitch: 1.25,
                    rate: 1
                };

                filterManager.filters.timescale = true;

                await filterManager.applyPlayerFilters();

                return message.channel.send({
                    embeds: [
                        createEmbed(
                            "🌙 **ØªÙ… ØªÙØ¹ÙŠÙ„ Nightcore!**\n\nØ²Ø§Ø¯Øª Ø§Ù„Ø³Ø±Ø¹Ø© ÙˆØ§Ù„Ù†Ø¨Ø±Ø©."
                        )
                    ]
                });
            }

            // ==========================================
            // SLOWED
            // ==========================================

            if (
                filter === "slowed" ||
                filter === "slow"
            ) {
                await filterManager.resetFilters();

                await filterManager.setSpeed(0.80);

                return message.channel.send({
                    embeds: [
                        createEmbed(
                            "🐾 **ØªÙ… ØªÙØ¹ÙŠÙ„ Ø§Ù„ØªØ¨Ø·ÙŠØ¡!**\n\nØµØ§Ø±Øª Ø§Ù„Ø£ØºÙ†ÙŠØ© ØªØ´ØªØºÙ„ Ø£Ø¨Ø·Ø£."
                        )
                    ]
                });
            }

            // ==========================================
            // SPEED UP
            // ==========================================

            if (
                filter === "speedup" ||
                filter === "spedup" ||
                filter === "speed"
            ) {
                await filterManager.resetFilters();

                await filterManager.setSpeed(1.25);

                return message.channel.send({
                    embeds: [
                        createEmbed(
                            "⚡ **ØªÙ… ØªÙØ¹ÙŠÙ„ Ø§Ù„ØªØ³Ø±ÙŠØ¹!**\n\nØµØ§Ø±Øª Ø§Ù„Ø£ØºÙ†ÙŠØ© ØªØ´ØªØºÙ„ Ø£Ø³Ø±Ø¹."
                        )
                    ]
                });
            }

            // ==========================================
            // UNKNOWN FILTER
            // ==========================================

            return message.reply({
                embeds: [
                    createEmbed(
                        `❌ ÙÙ„ØªØ± ØºÙŠØ± Ù…Ø¹Ø±ÙˆÙ: **${args.join(" ")}**\n\nØ§Ø³ØªØ®Ø¯Ù… \`>filters\` Ù„ØªØ´ÙˆÙ Ø§Ù„ÙÙ„Ø§ØªØ± Ø§Ù„Ù…ØªÙˆÙØ±Ø©.`
                    )
                ]
            });

        } catch (error) {
            console.error(
                "❌ Filter command error:",
                error
            );

            await message.reply({
                embeds: [
                    createEmbed(
                        "❌ ØµØ§Ø± ÙÙŠ Ø®Ø·Ø£ ÙˆØ­Ù†Ø§ Ù†Ø·Ø¨Ù‚ Ø§Ù„ÙÙ„ØªØ±."
                    )
                ]
            }).catch(() => {});
        }
    }
};

