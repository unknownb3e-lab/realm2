const Guild247 = require("../models/Guild247");

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    name: "clientReady",

    async execute(client) {
        try {
            console.log("🤖 Discord client ready!");

            // ==========================================
            // WAIT FOR LAVALINK
            // ==========================================

            let connected = false;

            for (let attempt = 1; attempt <= 20; attempt++) {
                try {
                    const nodes =
                        client.lavalink.nodeManager.nodes;

                    if (nodes && nodes.size > 0) {
                        for (const node of nodes.values()) {
                            if (node.connected) {
                                connected = true;
                                break;
                            }
                        }
                    }

                    if (connected) {
                        break;
                    }

                    console.log(
                        `⏳ Waiting for Lavalink... (${attempt}/20)`
                    );

                    await wait(1000);

                } catch (error) {
                    console.error(
                        "❌ Lavalink check error:",
                        error
                    );

                    await wait(1000);
                }
            }

            if (!connected) {
                console.error(
                    "❌ Lavalink did not become ready. 24/7 reconnect skipped."
                );
                return;
            }

            console.log(
                "🎵 Lavalink ready. Restoring 24/7 servers..."
            );

            // ==========================================
            // LOAD 24/7 SERVERS
            // ==========================================

            const guilds247 =
                await Guild247.find({
                    enabled: true
                });

            console.log(
                `🔒 Found ${guilds247.length} server(s) with 24/7 enabled.`
            );

            // ==========================================
            // RECONNECT SERVERS
            // ==========================================

            for (const data of guilds247) {
                try {
                    const guild =
                        client.guilds.cache.get(
                            data.guildId
                        );

                    if (!guild) {
                        console.log(
                            `⚠️ Guild not found: ${data.guildId}`
                        );
                        continue;
                    }

                    const voiceChannel =
                        guild.channels.cache.get(
                            data.voiceChannelId
                        );

                    if (
                        !voiceChannel ||
                        !voiceChannel.isVoiceBased()
                    ) {
                        console.log(
                            `⚠️ Voice channel not found for ${guild.name}`
                        );
                        continue;
                    }

                    let player =
                        client.lavalink.getPlayer(
                            data.guildId
                        );

                    // ==================================
                    // CREATE PLAYER
                    // ==================================

                    if (!player) {
                        player =
                            client.lavalink.createPlayer({
                                guildId:
                                    data.guildId,

                                voiceChannelId:
                                    data.voiceChannelId,

                                textChannelId:
                                    data.textChannelId,

                                selfDeaf: true,
                                selfMute: false,
                                volume: 75
                            });
                    }

                    // ==================================
                    // CONNECT
                    // ==================================

                    if (!player.connected) {
                        await player.connect();
                    }

                    // ==================================
                    // RESTORE DATA
                    // ==================================

                    player.setData(
                        "247",
                        true
                    );

                    player.setData(
                        "manualLeave",
                        false
                    );

                    console.log(
                        `🔒 24/7 reconnected: ${guild.name} → ${voiceChannel.name}`
                    );

                } catch (error) {
                    console.error(
                        `❌ Failed to reconnect 24/7 for ${data.guildId}:`,
                        error
                    );
                }
            }

        } catch (error) {
            console.error(
                "❌ 24/7 startup error:",
                error
            );
        }
    }
};