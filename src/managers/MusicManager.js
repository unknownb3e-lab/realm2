const { LavalinkManager } = require("lavalink-client");
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

function formatDuration(ms) {
    if (!ms || ms < 0) return "00:00";

    const totalSeconds = Math.floor(ms / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function createMusicManager(client) {
    const manager = new LavalinkManager({
        nodes: [
            {
                id: process.env.LAVALINK_NAME || "Main",
                host: process.env.LAVALINK_HOST,
                port: Number(process.env.LAVALINK_PORT) || 2333,
                authorization: process.env.LAVALINK_PASSWORD,
                secure: process.env.LAVALINK_SECURE === "true",

                retryAmount: 5,
                retryDelay: 3000,
            },
        ],

        sendToShard: (guildId, payload) => {
            const guild = client.guilds.cache.get(guildId);

            if (guild) {
                guild.shard.send(payload);
            }
        },

        autoSkip: true,

        client: {
            id: client.user?.id || "",
            username: client.user?.username || "Yowa",
        },

        // ==========================================
        // PLAYER OPTIONS
        // ==========================================

        playerOptions: {
            defaultSearchPlatform: "ytmsearch",

            onDisconnect: {
                autoReconnect: true,
                destroyPlayer: false,
            },

            onEmptyQueue: {
                destroyAfterMs: -1,

                // ==========================================
                // AUTOPLAY
                // ==========================================

                autoPlayFunction: async (player, lastPlayedTrack) => {
                    try {
                        // Autoplay OFF
                        if (player.getData("autoplay") !== true) {
                            return;
                        }

                        if (!lastPlayedTrack) {
                            console.log(
                                "⚠️ Autoplay: No previous track found."
                            );
                            return;
                        }

                        const title =
                            lastPlayedTrack.info?.title;

                        const author =
                            lastPlayedTrack.info?.author;

                        if (!title) {
                            console.log(
                                "⚠️ Autoplay: Track title unavailable."
                            );
                            return;
                        }

                        // ==========================================
                        // SEARCH SIMILAR SONGS
                        // ==========================================

                        const query = author
                            ? `${author} ${title}`
                            : title;

                        console.log(
                            `🔄 Autoplay searching: ${query}`
                        );

                        const result = await player.search(
                            {
                                query,
                                source: "ytmsearch"
                            }
                        );

                        if (
                            !result ||
                            !result.tracks ||
                            result.tracks.length === 0
                        ) {
                            console.log(
                                "⚠️ Autoplay: No results found."
                            );
                            return;
                        }

                        const currentIdentifier =
                            lastPlayedTrack.info?.identifier;

                        const currentUri =
                            lastPlayedTrack.info?.uri;

                        const currentTitle =
                            String(
                                lastPlayedTrack.info?.title || ""
                            ).toLowerCase();

                        // ==========================================
                        // REMOVE SAME SONG
                        // ==========================================

                        const differentTracks =
                            result.tracks.filter(track => {

                                const identifier =
                                    track.info?.identifier;

                                const uri =
                                    track.info?.uri;

                                const trackTitle =
                                    String(
                                        track.info?.title || ""
                                    ).toLowerCase();

                                // Same identifier
                                if (
                                    identifier &&
                                    currentIdentifier &&
                                    identifier === currentIdentifier
                                ) {
                                    return false;
                                }

                                // Same URL
                                if (
                                    uri &&
                                    currentUri &&
                                    uri === currentUri
                                ) {
                                    return false;
                                }

                                // Exact same title
                                if (
                                    trackTitle &&
                                    currentTitle &&
                                    trackTitle === currentTitle
                                ) {
                                    return false;
                                }

                                return true;
                            });

                        // ==========================================
                        // NO DIFFERENT RESULT
                        // ==========================================

                        if (differentTracks.length === 0) {
                            console.log(
                                "⚠️ Autoplay: Couldn't find a different song."
                            );
                            return;
                        }

                        // ==========================================
                        // PICK RANDOM SONG
                        // ==========================================

                        const randomIndex =
                            Math.floor(
                                Math.random() *
                                differentTracks.length
                            );

                        const nextTrack =
                            differentTracks[randomIndex];

                        // ==========================================
                        // MARK AUTOPLAY REQUESTER
                        // ==========================================

                        nextTrack.requester = "التشغيل التلقائي";

                        // ==========================================
                        // ADD TO QUEUE
                        // ==========================================

                        player.queue.add(nextTrack);

                        console.log(
                            `🎵 Autoplay added: ${
                                nextTrack.info?.title ||
                                "Unknown Title"
                            }`
                        );

                    } catch (error) {
                        console.error(
                            "❌ Autoplay error:",
                            error
                        );
                    }
                },
            },
        },
    });

    // ==========================================
    // TRACK START
    // ==========================================

    manager.on("trackStart", async (player, track) => {
        try {
            const channel = client.channels.cache.get(
                player.textChannelId
            );

            if (!channel) return;

            const title =
                track.info?.title || "عنوان غير معروف";

            const author =
                track.info?.author || "فنان غير معروف";

            const duration =
                formatDuration(track.info?.duration);

            const artwork =
                track.info?.artworkUrl ||
                track.info?.thumbnail ||
                null;

            const requester =
                track.requester ||
                track.info?.requester ||
                "غير معروف";

            const volume =
                player.volume ?? 75;

            const embed = new EmbedBuilder()
                .setColor("#808080")
                .setTitle(title)
                .setDescription(
                    `**${author}**\n\n` +
                    `طلبها: ${requester}\n` +
                    `المدة: **${duration}** • الصوت: **${volume}%**`
                )
                .setFooter({
                    text: "Yowa Music"
                });

            if (artwork) {
                embed.setImage(artwork);
            }

            const buttons =
                new ActionRowBuilder().addComponents(

                    new ButtonBuilder()
                        .setCustomId("music_previous")
                        .setEmoji("⏮️")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("music_pause")
                        .setEmoji("⏸️")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("music_skip")
                        .setEmoji("⏭️")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("music_stop")
                        .setEmoji("⏹️")
                        .setStyle(ButtonStyle.Secondary)
                );

            await channel.send({
                content: `🎵 تشتغل الآن **${title}**`,
                embeds: [embed],
                components: [buttons]
            });

        } catch (error) {
            console.error(
                "❌ Track start panel error:",
                error
            );
        }
    });

    return manager;
}

module.exports = {
    createMusicManager
};