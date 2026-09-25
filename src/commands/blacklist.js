const {
    EmbedBuilder
} = require("discord.js");

const Blacklist = require("../models/Blacklist");

function createEmbed(description) {
    return new EmbedBuilder()
        .setColor("#2a2a2a")
        .setDescription(description)
        .setFooter({
            text: "anas"
        });
}

module.exports = {
    name: "blacklist",

    async execute({ client, message, args }) {
        try {
            // ==========================================
            // OWNER ONLY
            // ==========================================

            const ownerId =
                process.env.OWNER_ID;

            if (
                !ownerId ||
                message.author.id !== ownerId
            ) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ Ø¨Ø³ Ù…Ø§Ù„Ùƒ Ø§Ù„Ø¨ÙˆØª ÙŠÙ‚Ø¯Ø± ÙŠØ³ØªØ®Ø¯Ù… Ù‡Ø°Ø§ Ø§Ù„Ø£Ù…Ø±."
                        )
                    ]
                });
            }

            const action =
                args[0]?.toLowerCase();

            // ==========================================
            // LIST
            // ==========================================

            if (action === "list") {
                const users =
                    await Blacklist.find()
                        .sort({
                            addedAt: -1
                        });

                if (!users.length) {
                    return message.reply({
                        embeds: [
                            createEmbed(
                                "📋 Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø­Ø¸Ø± ÙØ§Ø¶ÙŠØ©."
                            )
                        ]
                    });
                }

                const list = users
                    .map(
                        (user, index) =>
                            `**${index + 1}.** <@${user.userId}> \`(${user.userId})\``
                    )
                    .join("\n");

                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#2a2a2a")
                            .setTitle("🚫 Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…ÙŠÙ† Ø§Ù„Ù…Ø­Ø¸ÙˆØ±ÙŠÙ†")
                            .setDescription(list)
                            .setFooter({
                                text: `Ø§Ù„Ù…Ø¬Ù…ÙˆØ¹: ${users.length} Ù…Ø³ØªØ®Ø¯Ù…`
                            })
                    ]
                });
            }

            // ==========================================
            // REMOVE
            // ==========================================

            if (
                action === "remove" ||
                action === "unblacklist"
            ) {
                const user =
                    message.mentions.users.first();

                const userId =
                    user?.id ||
                    args[1];

                if (!userId) {
                    return message.reply({
                        embeds: [
                            createEmbed(
                                "❌ Ø§Ù„Ø±Ø¬Ø§Ø¡ Ù…Ù†Ø´Ù† Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù….\n\nÙ…Ø«Ø§Ù„: `>blacklist remove @user`"
                            )
                        ]
                    });
                }

                const result =
                    await Blacklist.findOneAndDelete({
                        userId
                    });

                if (!result) {
                    return message.reply({
                        embeds: [
                            createEmbed(
                                "❌ Ù‡Ø°Ø§ Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… Ù…Ùˆ Ù…Ø­Ø¸ÙˆØ± Ø£ØµÙ„Ø§Ù‹."
                            )
                        ]
                    });
                }

                return message.channel.send({
                    embeds: [
                        createEmbed(
                            `✅ ØªÙ… Ø±ÙØ¹ Ø§Ù„Ø­Ø¸Ø± Ø¹Ù† <@${userId}>.`
                        )
                    ]
                });
            }

            // ==========================================
            // ADD
            // ==========================================

            const user =
                message.mentions.users.first();

            const userId =
                user?.id ||
                args[0];

            if (!userId) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ Ø§Ù„Ø±Ø¬Ø§Ø¡ Ù…Ù†Ø´Ù† Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù….\n\n" +
                            "`>blacklist @user`\n" +
                            "`>blacklist remove @user`\n" +
                            "`>blacklist list`"
                        )
                    ]
                });
            }

            if (userId === client.user.id) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ Ù…Ø§ Ø£Ù‚Ø¯Ø± Ø£Ø­Ø¸Ø± Ù†ÙØ³ÙŠ."
                        )
                    ]
                });
            }

            const existing =
                await Blacklist.findOne({
                    userId
                });

            if (existing) {
                return message.reply({
                    embeds: [
                        createEmbed(
                            "❌ Ù‡Ø°Ø§ Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… Ù…Ø­Ø¸ÙˆØ± Ù…Ø³Ø¨Ù‚Ù‹Ø§."
                        )
                    ]
                });
            }

            await Blacklist.create({
                userId,
                addedBy: message.author.id
            });

            return message.channel.send({
                embeds: [
                    createEmbed(
                        `🚫 ØªÙ… **Ø­Ø¸Ø±** <@${userId}> Ù…Ù† Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø£ÙˆØ§Ù…Ø± anas.`
                    )
                ]
            });

        } catch (error) {
            console.error(
                "❌ Blacklist command error:",
                error
            );

            await message.reply({
                embeds: [
                    createEmbed(
                        "❌ ØµØ§Ø± ÙÙŠ Ø®Ø·Ø£ ÙˆØ­Ù†Ø§ Ù†Ø¯ÙŠØ± Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø­Ø¸Ø±."
                    )
                ]
            }).catch(() => {});
        }
    }
};

