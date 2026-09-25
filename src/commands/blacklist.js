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
                            "❌ بس مالك البوت يقدر يستخدم هاذا الأمر."
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
                                "📋 قائمة الحظر فارغة."
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
                            .setTitle("🚫 المستخدمين المحظورين")
                            .setDescription(list)
                            .setFooter({
                                text: `المجموع: ${users.length} مستخدم`
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
                                "❌ الرجاء منشن المستخدم.\n\nمثال: `>blacklist remove @user`"
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
                                "❌ هاذا المستخدم مو محظور أصلاً."
                            )
                        ]
                    });
                }

                return message.channel.send({
                    embeds: [
                        createEmbed(
                            `✅ تم رفع الحظر عن <@${userId}>.`
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
                            "❌ الرجاء منشن المستخدم.\n\n" +
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
                            "❌ ما أقدر أحظر نفسي."
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
                            "❌ هاذا المستخدم محظور مسبقاً."
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
                        `🚫 تم **حظر** <@${userId}> من استخدام أوامر anas.`
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
                        "❌ صار في خطأ وحنا ندير قائمة الحظر."
                    )
                ]
            }).catch(() => {});
        }
    }
};
