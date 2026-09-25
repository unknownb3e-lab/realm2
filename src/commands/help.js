const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const PREFIX = () => process.env.PREFIX || ">";

const categories = {
    music: {
        name: "Ø§Ù„Ù…ÙˆØ³ÙŠÙ‚Ù‰",
        emoji: "ðŸŽµ",
        commands: [
            ["247", "Ø§Ø³ØªÙ…ØªØ¹ Ø¨ÙˆØ¶Ø¹ ØªØ´ØºÙŠÙ„ 24/7"],
            ["clear", "Ø­Ø°Ù Ø§Ù„Ø£ØºØ§Ù†ÙŠ Ù…Ù† Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©"],
            ["filter", "Ø¥Ø¯Ø§Ø±Ø© ÙÙ„Ø§ØªØ± Ø§Ù„ØµÙˆØª"],
            ["leave", "Ù…ØºØ§Ø¯Ø±Ø© Ø§Ù„Ø±ÙˆÙ… Ø§Ù„ØµÙˆØªÙŠ"],
            ["loop", "ØªÙƒØ±Ø§Ø± Ø£Ùˆ Ø¥ÙŠÙ‚Ø§Ù ØªÙƒØ±Ø§Ø± Ø§Ù„Ø£ØºÙ†ÙŠØ© Ø§Ù„Ø­Ø§Ù„ÙŠØ©"],
            ["lyrics", "Ø¹Ø±Ø¶ ÙƒÙ„Ù…Ø§Øª Ø§Ù„Ø£ØºÙ†ÙŠØ© Ø§Ù„Ø­Ø§Ù„ÙŠØ©"],
            ["nowplaying", "Ø¹Ø±Ø¶ Ø§Ù„Ø£ØºÙ†ÙŠØ© Ø§Ù„Ù„ÙŠ ØªØ´ØªØºÙ„ Ø­Ø§Ù„ÙŠÙ‹Ø§"],
            ["pause", "Ø¥ÙŠÙ‚Ø§Ù Ø§Ù„Ø£ØºÙ†ÙŠØ© Ø§Ù„Ø­Ø§Ù„ÙŠØ© Ù…Ø¤Ù‚ØªÙ‹Ø§"],
            ["play", "ØªØ´ØºÙŠÙ„ Ø£ØºÙ†ÙŠØ©"],
            ["previous", "ØªØ´ØºÙŠÙ„ Ø§Ù„Ø£ØºÙ†ÙŠØ© Ø§Ù„Ø³Ø§Ø¨Ù‚Ø©"],
            ["queue", "Ø¹Ø±Ø¶ Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø£ØºØ§Ù†ÙŠ Ø§Ù„Ø­Ø§Ù„ÙŠØ©"],
            ["remove", "Ø­Ø°Ù Ø£ØºÙ†ÙŠØ© Ù…Ù† Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©"],
            ["replay", "Ø¥Ø¹Ø§Ø¯Ø© ØªØ´ØºÙŠÙ„ Ø§Ù„Ø£ØºÙ†ÙŠØ© Ø§Ù„Ø­Ø§Ù„ÙŠØ©"],
            ["resume", "Ø§Ø³ØªØ¦Ù†Ø§Ù Ø§Ù„Ø£ØºÙ†ÙŠØ© Ø§Ù„Ù…ØªÙˆÙ‚ÙØ©"],
            ["skip", "ØªØ®Ø·ÙŠ Ø§Ù„Ø£ØºÙ†ÙŠØ© Ø§Ù„Ø­Ø§Ù„ÙŠØ©"],
            ["stop", "Ø¥ÙŠÙ‚Ø§Ù Ø§Ù„Ù…ÙˆØ³ÙŠÙ‚Ù‰ ÙˆØªÙØ±ÙŠØº Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©"],
            ["volume", "ØªØºÙŠÙŠØ± Ù…Ø³ØªÙˆÙ‰ ØµÙˆØª Ø§Ù„Ù…ÙˆØ³ÙŠÙ‚Ù‰"]
        ]
    },
    
    admin: {
        name: "Ø§Ù„Ø¥Ø¯Ø§Ø±Ø©",
        emoji: "ðŸ›¡ï¸",
        commands: [
            ["blacklist add", "Ø¥Ø¶Ø§ÙØ© Ù…Ø³ØªØ®Ø¯Ù… Ù„Ù„Ø­Ø¸Ø±"],
            ["blacklist remove", "Ø±ÙØ¹ Ø§Ù„Ø­Ø¸Ø± Ø¹Ù† Ù…Ø³ØªØ®Ø¯Ù…"],
            ["blacklist list", "Ø¹Ø±Ø¶ ÙƒÙ„ Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…ÙŠÙ† Ø§Ù„Ù…Ø­Ø¸ÙˆØ±ÙŠÙ†"]
        ]
    },

    info: {
        name: "Ù…Ø¹Ù„ÙˆÙ…Ø§Øª",
        emoji: "â„¹ï¸",
        type: "info",
        commands: []
    }
};

function makeEmbed(category, page, totalPages, client) {
    const data = categories[category];

    if (data.type === "info") {
        const guildCount = client.guilds.cache.size;
        const userCount = client.guilds.cache.reduce((total, guild) => total + (guild.memberCount || 0), 0);

        return new EmbedBuilder()
            .setColor("#808080")
            .setTitle(`${data.emoji} ${data.name}`)
            .setDescription(
                `**Ø¨ÙˆØª Ø§ØºØ§Ù†ÙŠ Ù…Ø­ØªØ±Ù**\n\n` +
                `**Ø§Ù„Ù…Ø·ÙˆØ±:** anas\n` +
                `**Ø§Ù„Ø³ÙŠØ±ÙØ±Ø§Øª:** \`${guildCount}\`\n` +
                `**Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù…ÙŠÙ†:** \`${userCount.toLocaleString()}\``
            )
            .setFooter({
                text: "anas Music"
            })
            .setTimestamp();
    }

    const perPage = 10;

    const start = page * perPage;

    const commands = data.commands.slice(
        start,
        start + perPage
    );

    let description = "";

    for (const [name, desc] of commands) {
        description +=
            `**${PREFIX()}${name}**\n` +
            `â”• ${desc}\n\n`;
    }

    return new EmbedBuilder()
        .setColor("#808080")
        .setTitle(
            `${data.emoji} Ø£ÙˆØ§Ù…Ø± ${data.name} â€” ØµÙØ­Ø© ${page + 1}/${totalPages}`
        )
        .setDescription(description.trim())
        .setFooter({
            text: "anas Music â€¢ Ø§Ø³ØªØ®Ø¯Ù… Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ø¨Ø§Ù„Ø£Ø³ÙÙ„ Ù„ØªØµÙØ­ Ø§Ù„Ø£ÙˆØ§Ù…Ø±"
        });
}

function makeMenu(userId, selected) {
    return new StringSelectMenuBuilder()
        .setCustomId(`anas_help_menu_${userId}`)
        .setPlaceholder("Ø§Ø®ØªØ± Ù‚Ø³Ù…")
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(
            Object.entries(categories).map(
                ([value, data]) => ({
                    label: data.name,
                    value,
                    emoji: data.emoji,
                    default: value === selected
                })
            )
        );
}

function makeButtons(userId, page, totalPages) {
    return new ActionRowBuilder().addComponents(

        new ButtonBuilder()
            .setCustomId(
                `anas_help_previous_${userId}`
            )
            .setEmoji("â¬…ï¸")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(page <= 0),

        new ButtonBuilder()
            .setCustomId(
                `anas_help_next_${userId}`
            )
            .setEmoji("âž¡ï¸")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(page >= totalPages - 1)

    );
}

module.exports = {
    name: "help",

    async execute({ client, message }) {
        try {
            let category = "music";
            let page = 0;

            const perPage = 10;

            const getTotalPages = () => {
                const data = categories[category];

                if (data.type === "info") {
                    return 1;
                }

                return Math.max(
                    1,
                    Math.ceil(
                        data.commands.length /
                            perPage
                    )
                );
            };

            const buildComponents = () => {
                const totalPages = getTotalPages();
                const data = categories[category];

                const components = [
                    new ActionRowBuilder().addComponents(
                        makeMenu(
                            message.author.id,
                            category
                        )
                    )
                ];

                if (data.type !== "info") {
                    components.push(
                        makeButtons(
                            message.author.id,
                            page,
                            totalPages
                        )
                    );
                }

                return components;
            };

            const helpMessage =
                await message.channel.send({
                    embeds: [
                        makeEmbed(
                            category,
                            page,
                            getTotalPages(),
                            client
                        )
                    ],
                    components: buildComponents()
                });

            const collector =
                helpMessage.createMessageComponentCollector({
                    time: 5 * 60 * 1000
                });

            collector.on(
                "collect",
                async interaction => {

                    // ==================================
                    // ONLY COMMAND USER
                    // ==================================

                    if (
                        interaction.user.id !==
                        message.author.id
                    ) {
                        return interaction.reply({
                            content:
                                "âŒ Ø¨Ø³ Ø§Ù„Ù„ÙŠ ÙØªØ­ Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ù…Ø³Ø§Ø¹Ø¯Ø© Ù‡Ø§ÙŠ ÙŠÙ‚Ø¯Ø± ÙŠØ³ØªØ®Ø¯Ù…Ù‡Ø§.",
                            ephemeral: true
                        });
                    }

                    // ==================================
                    // CATEGORY MENU
                    // ==================================

                    if (
                        interaction.isStringSelectMenu()
                    ) {
                        category =
                            interaction.values[0];

                        page = 0;

                        return interaction.update({
                            embeds: [
                                makeEmbed(
                                    category,
                                    page,
                                    getTotalPages(),
                                    client
                                )
                            ],
                            components:
                                buildComponents()
                        });
                    }

                    // ==================================
                    // PREVIOUS PAGE
                    // ==================================

                    if (
                        interaction.customId.startsWith(
                            "anas_help_previous_"
                        )
                    ) {
                        if (page > 0) {
                            page--;
                        }

                        return interaction.update({
                            embeds: [
                                makeEmbed(
                                    category,
                                    page,
                                    getTotalPages(),
                                    client
                                )
                            ],
                            components:
                                buildComponents()
                        });
                    }

                    // ==================================
                    // NEXT PAGE
                    // ==================================

                    if (
                        interaction.customId.startsWith(
                            "anas_help_next_"
                        )
                    ) {
                        if (
                            page <
                            getTotalPages() - 1
                        ) {
                            page++;
                        }

                        return interaction.update({
                            embeds: [
                                makeEmbed(
                                    category,
                                    page,
                                    getTotalPages(),
                                    client
                                )
                            ],
                            components:
                                buildComponents()
                        });
                    }
                }
            );

            // ==========================================
            // EXPIRE
            // ==========================================

            collector.on(
                "end",
                async () => {
                    try {
                        await helpMessage.edit({
                            components: []
                        });
                    } catch {}
                }
            );

        } catch (error) {
            console.error(
                "âŒ Help command error:",
                error
            );

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#808080")
                        .setDescription(
                            "âŒ ØµØ§Ø± ÙÙŠ Ø®Ø·Ø£ ÙˆØ­Ù†Ø§ Ù†ÙØªØ­ Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ù…Ø³Ø§Ø¹Ø¯Ø©."
                        )
                ]
            }).catch(() => {});
        }
    }
};

