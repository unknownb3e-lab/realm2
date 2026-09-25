const { EmbedBuilder, ApplicationFlags } = require("discord.js");

module.exports = {
    name: "modalSubmit",

    async execute(client, interaction) {
        if (!interaction.isModalSubmit()) return;

        if (!interaction.customId.startsWith("join_modal_")) {
            return;
        }

        const songInput = interaction.fields.getTextInputValue("song_input");

        if (!songInput) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2a2a2a")
                        .setDescription("❌ الرجاء كتابة اسم الأغنية أو الرابط.")
                ],
                flags: [ApplicationFlags.Ephemeral]
            });
        }

        try {
            const player = client.lavalink.getPlayer(interaction.guildId);

            if (!player) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#2a2a2a")
                            .setDescription("❌ ماكو مشغل موسيقى شغال حالياً.")
                    ],
                    flags: [ApplicationFlags.Ephemeral]
                });
            }

            const result = await player.search({
                query: songInput,
                source: "ytmsearch"
            });

            if (!result || !result.tracks || result.tracks.length === 0) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#2a2a2a")
                            .setDescription("❌ ما لقيت نتائج لهاذا البحث.")
                    ],
                    flags: [ApplicationFlags.Ephemeral]
                });
            }

            const track = result.tracks[0];

            player.queue.add(track);

            if (!player.playing && !player.paused) {
                await player.play();
            }

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2a2a2a")
                        .setDescription(
                            `🎵 **${track.info?.title || "عنوان غير معروف"}**\n\nتمت الإضافة للقائمة.`
                        )
                        .setFooter({
                            text: "anas Music"
                        })
                ],
                flags: [ApplicationFlags.Ephemeral]
            });

        } catch (error) {
            console.error("❌ Modal submit error:", error);

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2a2a2a")
                        .setDescription("❌ صار في خطأ وحنا نشغل الأغنية.")
                ],
                flags: [ApplicationFlags.Ephemeral]
            }).catch(() => {});
        }
    }
};
