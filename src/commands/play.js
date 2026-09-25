const { EmbedBuilder } = require("discord.js");

function createErrorEmbed(description) {
    return new EmbedBuilder()
        .setColor("#2a2a2a")
        .setDescription(`❌ ${description}`);
}

module.exports = {
    name: "play",

    async execute({ client, message, args }) {
        try {
            // ==========================================
            // QUERY CHECK
            // ==========================================

            if (!args.length) {
                return message.reply({
                    embeds: [
                        createErrorEmbed(
                            `الرجاء كتابة اسم الأغنية.\n\nمثال: \`>play Afsanay\``
                        )
                    ]
                });
            }

            // ==========================================
            // VOICE CHANNEL CHECK
            // ==========================================

            const voiceChannel = message.member?.voice?.channel;

            if (!voiceChannel) {
                return message.reply({
                    embeds: [
                        createErrorEmbed(
                            "يجب أن تكون داخل روم صوتي لاستخدام هذا الأمر."
                        )
                    ]
                });
            }

            // ==========================================
            // CREATE / GET PLAYER
            // ==========================================

            let player = client.lavalink.getPlayer(message.guild.id);

            if (!player) {
                player = client.lavalink.createPlayer({
                    guildId: message.guild.id,
                    voiceChannelId: voiceChannel.id,
                    textChannelId: message.channel.id,

                    selfDeaf: true,
                    selfMute: false,

                    volume: 75
                });
            } else {
                if (
                    player.voiceChannelId &&
                    player.voiceChannelId !== voiceChannel.id
                ) {
                    await player.setVoiceChannelId(voiceChannel.id);
                    await player.stopPlaying();
                }

                player.voiceChannelId = voiceChannel.id;
                player.textChannelId = message.channel.id;
            }

            // ==========================================
            // CONNECT
            // ==========================================

            if (!player.connected) {
                await player.connect();
            }

            // ==========================================
            // SEARCH
            // ==========================================

            const query = args.join(" ");

            let result = await player.search({
                query,
                source: "ytmsearch"
            });

            if (!result?.tracks?.length) {
                result = await player.search({
                    query,
                    source: "ytsearch"
                });
            }

            if (
                !result ||
                !result.tracks ||
                result.tracks.length === 0
            ) {
                return message.reply({
                    embeds: [
                        createErrorEmbed(
                            `ماكو نتائج لـ **${query}**.`
                        )
                    ]
                });
            }

            // ==========================================
            // GET TRACK
            // ==========================================

            const track = result.tracks[0];

            // Save requester
            track.requester = message.author;

            // ==========================================
            // CHECK CURRENT PLAYBACK
            // ==========================================

            const alreadyPlaying =
                player.playing ||
                player.paused ||
                !!player.queue.current;

            // ==========================================
            // ADD TO QUEUE
            // ==========================================

            player.queue.add(track);

            const title =
                track.info?.title || "عنوان غير معروف";

            // ==========================================
            // START PLAYBACK
            // ==========================================

            if (!alreadyPlaying) {
                await player.play();

                // DON'T SEND PANEL HERE.
                // trackStart event handles the Now Playing panel.

                return;
            }

            // ==========================================
            // ALREADY PLAYING
            // ==========================================

            await message.channel.send({
                content: `🎵 تمت إضافة **${title}** إلى قائمة الانتظار!`
            });

        } catch (error) {
            console.error(
                "❌ Play command error:",
                error
            );

            await message.reply({
                embeds: [
                    createErrorEmbed(
                        "صار في خطأ وحنا نحاول نشغل هاي الأغنية."
                    )
                ]
            }).catch(() => {});
        }
    }
};
