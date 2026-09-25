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
        name: "الموسيقى",
        emoji: "🎵",
        commands: [
            ["247", "استمتع بوضع تشغيل 24/7"],
            ["clear", "حذف الأغاني من القائمة"],
            ["filter", "إدارة فلاتر الصوت"],
            ["leave", "مغادرة الروم الصوتي"],
            ["loop", "تكرار أو إيقاف تكرار الأغنية الحالية"],
            ["lyrics", "عرض كلمات الأغنية الحالية"],
            ["nowplaying", "عرض الأغنية اللي تشتغل حاليًا"],
            ["pause", "إيقاف الأغنية الحالية مؤقتًا"],
            ["play", "تشغيل أغنية"],
            ["previous", "تشغيل الأغنية السابقة"],
            ["queue", "عرض قائمة الأغاني الحالية"],
            ["remove", "حذف أغنية من القائمة"],
            ["replay", "إعادة تشغيل الأغنية الحالية"],
            ["resume", "استئناف الأغنية المتوقفة"],
            ["skip", "تخطي الأغنية الحالية"],
            ["stop", "إيقاف الموسيقى وتفريغ القائمة"],
            ["volume", "تغيير مستوى صوت الموسيقى"]
        ]
    },
    
    admin: {
        name: "الإدارة",
        emoji: "🛡️",
        commands: [
            ["blacklist add", "إضافة مستخدم للحظر"],
            ["blacklist remove", "رفع الحظر عن مستخدم"],
            ["blacklist list", "عرض كل المستخدمين المحظورين"]
        ]
    },

    info: {
        name: "معلومات",
        emoji: "ℹ️",
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
            .setColor("#2a2a2a")
            .setTitle(`${data.emoji} ${data.name}`)
            .setDescription(
                `**بوت اغاني احترافي**\n\n` +
                `**المطور:** anas\n` +
                `**السيرفرات:** \`${guildCount}\`\n` +
                `**المستخدمين:** \`${userCount.toLocaleString()}\``
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
            `┕ ${desc}\n\n`;
    }

    return new EmbedBuilder()
        .setColor("#2a2a2a")
        .setTitle(
            `${data.emoji} أوامر ${data.name} — صفحة ${page + 1}/${totalPages}`
        )
        .setDescription(description.trim())
        .setFooter({
            text: "anas Music • استخدم القائمة بالأسفل لتصفح الأوامر"
        });
}

function makeMenu(userId, selected) {
    return new StringSelectMenuBuilder()
        .setCustomId(`anas_help_menu_${userId}`)
        .setPlaceholder("اختر قسم")
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
            .setEmoji("⬅️")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(page <= 0),

        new ButtonBuilder()
            .setCustomId(
                `anas_help_next_${userId}`
            )
            .setEmoji("➡️")
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
                                "❌ بس اللي فتح قائمة المساعدة هاي يقدر يستخدمها.",
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
                "❌ Help command error:",
                error
            );

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2a2a2a")
                        .setDescription(
                            "❌ صار في خطأ وحنا نفتح قائمة المساعدة."
                        )
                ]
            }).catch(() => {});
        }
    }
};
