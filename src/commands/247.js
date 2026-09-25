const { EmbedBuilder } = require("discord.js");
const Guild247 = require("../models/Guild247");

function createEmbed(description) {
    return new EmbedBuilder()
        .setColor("#808080")
        .setDescription(description)
        .setFooter({
            text: "Yowa Music"
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
                                "❌ لازم البوت يكون متصل بروم صوتي أول شي."
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
                                "❌ ما قدرت أحدد الروم الصوتي تبعي."
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
                            "🔒 **تم تفعيل وضع 24/7.**\n\nرح أضل متصل بالروم الصوتي حتى بعد إعادة التشغيل."
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
                            "🔓 **تم إيقاف وضع 24/7.**\n\nما رح أتصل تلقائيًا بعد ما أطلع أو تنعمل إعادة تشغيل."
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
                                "❌ لازم البوت يكون متصل بروم صوتي أول شي."
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
                                "❌ ما قدرت أحدد الروم الصوتي تبعي."
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
                            "🔒 **تم تفعيل وضع 24/7.**\n\nرح أضل متصل بالروم الصوتي حتى بعد إعادة التشغيل."
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
                        "🔓 **تم إيقاف وضع 24/7.**"
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
                        "❌ صار في خطأ وحنا نغير وضع 24/7."
                    )
                ]
            }).catch(() => {});
        }
    }
};