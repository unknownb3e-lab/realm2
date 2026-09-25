const { EmbedBuilder } = require("discord.js");

function errorEmbed(description) {
    return new EmbedBuilder()
        .setColor("#2a2a2a")
        .setDescription(`❌ ${description}`);
}

module.exports = {
    name: "loop",

    async execute({ client, message, args }) {
        try {
            const player = client.lavalink.getPlayer(
                message.guild.id
            );

            if (!player) {
                return message.reply({
                    embeds: [
                        errorEmbed(
                            "ماكو مشغل موسيقى شغال حالياً."
                        )
                    ]
                });
            }

            const voiceChannel = message.member?.voice?.channel;

            if (!voiceChannel) {
                return message.reply({
                    embeds: [
                        errorEmbed(
                            "لازم تكون بروم صوتي حتى تستخدم هاذا الأمر."
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
                        errorEmbed(
                            "لازم تكون بنفس الروم الصوتي مع البوت."
                        )
                    ]
                });
            }

            const mode = args[0]?.toLowerCase();

            // ==========================================
            // SHOW CURRENT MODE
            // ==========================================

            if (!mode) {
                const currentMode =
                    player.repeatMode || "off";

                const displayMode =
                    currentMode === "track"
                        ? "الأغنية"
                        : currentMode === "queue"
                        ? "القائمة"
                        : "متوقف";

                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#2a2a2a")
                            .setDescription(
                                `🔁 وضع التكرار الحالي: **${displayMode}**\n\n` +
                                `استخدم \`>loop off\`، \`>loop song\` أو \`>loop queue\`.`
                            )
                            .setFooter({
                                text: "anas Music"
                            })
                    ]
                });
            }

            // ==========================================
            // CONVERT USER INPUT
            // ==========================================

            let repeatMode;

            if (mode === "off") {
                repeatMode = "off";
            } else if (
                mode === "song" ||
                mode === "track"
            ) {
                repeatMode = "track";
            } else if (mode === "queue") {
                repeatMode = "queue";
            } else {
                return message.reply({
                    embeds: [
                        errorEmbed(
                            "وضع تكرار غير صحيح.\n\nاستخدم `>loop off`، `>loop song` أو `>loop queue`."
                        )
                    ]
                });
            }

            // ==========================================
            // SET REPEAT MODE
            // ==========================================

            await player.setRepeatMode(repeatMode);

            // ==========================================
            // SUCCESS MESSAGE
            // ==========================================

            let description;

            if (repeatMode === "off") {
                description = "🔁 تم إيقاف التكرار.";
            } else if (repeatMode === "track") {
                description = "🔂 الأغنية الحالية رح تتكرر.";
            } else {
                description = "🔁 القائمة رح تتكرر.";
            }

            const embed = new EmbedBuilder()
                .setColor("#2a2a2a")
                .setDescription(description)
                .setFooter({
                    text: "anas Music"
                });

            await message.channel.send({
                embeds: [embed]
            });

        } catch (error) {
            console.error(
                "❌ Loop command error:",
                error
            );

            await message.reply({
                embeds: [
                    errorEmbed(
                        "صار في خطأ وحنا نغير وضع التكرار."
                    )
                ]
            }).catch(() => {});
        }
    }
};
