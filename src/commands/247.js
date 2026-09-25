const { EmbedBuilder } = require("discord.js");
const Guild247 = require("../models/Guild247");

function createEmbed(description) {
    return new EmbedBuilder()
        .setColor("#2a2a2a")
        .setDescription(description)
        .setFooter({
            text: "anas Music"
        });
}

module.exports = {
    name: "247",

    async execute({ client, message, args }) {
        try {
            let player = client.lavalink.getPlayer(
                message.guild.id
            );

            const action =
                args[0]?.toLowerCase();

            // ==========================================
            // ENABLE
            // ==========================================

            if (action === "on") {
                if (!player || !player.connected) {
                    return message.reply({
                        embeds: [
                            createEmbed(
                                "❌ Ù„Ø§Ø²Ù… Ø§Ù„Ø¨ÙˆØª ÙŠÙƒÙˆÙ† Ù…ØªØµÙ„ Ø¨Ø±ÙˆÙ… ØµÙˆØªÙŠ Ø£ÙˆÙ„ Ø´ÙŠ."
                            )
                        ]
                    });
                }

                const voiceChannelId =
                    player.voiceChannelId;

                if (!voiceChannelId) {
                    return message.reply({
                        embeds: [
                            createEmbed(
                                "❌ Ù…Ø§ Ù‚Ø¯Ø±Øª Ø£Ø­Ø¯Ø¯ Ø§Ù„Ø±ÙˆÙ… Ø§Ù„ØµÙˆØªÙŠ ØªØ¨Ø¹ÙŠ."
                            )
                        ]
                    });
                }

                await Guild247.findOneAndUpdate(
                    {
                        guildId: message.guild.id
                    },
                    {
                        guildId: message.guild.id,
                        enabled: true,
                        voiceChannelId,
                        textChannelId:
                            player.textChannelId ||
                            message.channel.id
                    },
                    {
                        upsert: true,
                        new: true
                    }
                );

                player.setData("247", true);
                player.setData(
                    "manualLeave",
                    false
                );

                return message.channel.send({
                    embeds: [
                        createEmbed(
                            "🔒 **ØªÙ… ØªÙØ¹ÙŠÙ„ ÙˆØ¶Ø¹ 24/7.**\n\nØ±Ø­ Ø£Ø¶Ù„ Ù…ØªØµÙ„ Ø¨Ø§Ù„Ø±ÙˆÙ… Ø§Ù„ØµÙˆØªÙŠ Ø­ØªÙ‰ Ø¨Ø¹Ø¯ Ø¥Ø¹Ø§Ø¯Ø© Ø§Ù„ØªØ´ØºÙŠÙ„."
                        )
                    ]
                });
            }

            // ==========================================
            // DISABLE
            // ==========================================

            if (action === "off") {
                await Guild247.findOneAndUpdate(
                    {
                        guildId: message.guild.id
                    },
                    {
                        enabled: false
                    }
                );

                if (player) {
                    player.setData("247", false);
                    player.setData(
                        "manualLeave",
                        false
                    );
                }

                return message.channel.send({
                    embeds: [
                        createEmbed(
                            "🔓 **ØªÙ… Ø¥ÙŠÙ‚Ø§Ù ÙˆØ¶Ø¹ 24/7.**\n\nÙ…Ø§ Ø±Ø­ Ø£ØªØµÙ„ ØªÙ„Ù‚Ø§Ø¦ÙŠÙ‹Ø§ Ø¨Ø¹Ø¯ Ù…Ø§ Ø£Ø·Ù„Ø¹ Ø£Ùˆ ØªÙ†Ø¹Ù…Ù„ Ø¥Ø¹Ø§Ø¯Ø© ØªØ´ØºÙŠÙ„."
                        )
                    ]
                });
            }

            // ==========================================
            // TOGGLE
            // ==========================================

            const saved247 =
                await Guild247.findOne({
                    guildId: message.guild.id
                });

            const current =
                saved247?.enabled === true;

            if (!current) {
                if (!player || !player.connected) {
                    return message.reply({
                        embeds: [
                            createEmbed(
                                "❌ Ù„Ø§Ø²Ù… Ø§Ù„Ø¨ÙˆØª ÙŠÙƒÙˆÙ† Ù…ØªØµÙ„ Ø¨Ø±ÙˆÙ… ØµÙˆØªÙŠ Ø£ÙˆÙ„ Ø´ÙŠ."
                            )
                        ]
                    });
                }

                const voiceChannelId =
                    player.voiceChannelId;

                if (!voiceChannelId) {
                    return message.reply({
                        embeds: [
                            createEmbed(
                                "❌ Ù…Ø§ Ù‚Ø¯Ø±Øª Ø£Ø­Ø¯Ø¯ Ø§Ù„Ø±ÙˆÙ… Ø§Ù„ØµÙˆØªÙŠ ØªØ¨Ø¹ÙŠ."
                            )
                        ]
                    });
                }

                await Guild247.findOneAndUpdate(
                    {
                        guildId: message.guild.id
                    },
                    {
                        guildId: message.guild.id,
                        enabled: true,
                        voiceChannelId,
                        textChannelId:
                            player.textChannelId ||
                            message.channel.id
                    },
                    {
                        upsert: true,
                        new: true
                    }
                );

                player.setData("247", true);
                player.setData(
                    "manualLeave",
                    false
                );

                return message.channel.send({
                    embeds: [
                        createEmbed(
                            "🔒 **ØªÙ… ØªÙØ¹ÙŠÙ„ ÙˆØ¶Ø¹ 24/7.**\n\nØ±Ø­ Ø£Ø¶Ù„ Ù…ØªØµÙ„ Ø¨Ø§Ù„Ø±ÙˆÙ… Ø§Ù„ØµÙˆØªÙŠ Ø­ØªÙ‰ Ø¨Ø¹Ø¯ Ø¥Ø¹Ø§Ø¯Ø© Ø§Ù„ØªØ´ØºÙŠÙ„."
                        )
                    ]
                });
            }

            await Guild247.findOneAndUpdate(
                {
                    guildId: message.guild.id
                },
                {
                    enabled: false
                }
            );

            if (player) {
                player.setData("247", false);
                player.setData(
                    "manualLeave",
                    false
                );
            }

            return message.channel.send({
                embeds: [
                    createEmbed(
                        "🔓 **ØªÙ… Ø¥ÙŠÙ‚Ø§Ù ÙˆØ¶Ø¹ 24/7.**"
                    )
                ]
            });

        } catch (error) {
            console.error(
                "❌ 24/7 command error:",
                error
            );

            await message.reply({
                embeds: [
                    createEmbed(
                        "❌ ØµØ§Ø± ÙÙŠ Ø®Ø·Ø£ ÙˆØ­Ù†Ø§ Ù†ØºÙŠØ± ÙˆØ¶Ø¹ 24/7."
                    )
                ]
            }).catch(() => {});
        }
    }
};
