const { loadCommands } = require("./handlers/commandHandler");
const { loadEvents } = require("./handlers/eventHandler");

require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Partials
} = require("discord.js");

const { createMusicManager } = require("./managers/MusicManager");
const { connectMongoDB } = require("./database/mongodb");

// ================================
// DISCORD CLIENT
// ================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ],

    partials: [
        Partials.Channel
    ]
});

// ================================
// BASIC VALIDATION
// ================================

if (!process.env.DISCORD_TOKEN) {
    console.error("❌ DISCORD_TOKEN is missing from .env");
    process.exit(1);
}

if (!process.env.LAVALINK_HOST) {
    console.error("❌ LAVALINK_HOST is missing from .env");
    process.exit(1);
}

if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI is missing from .env");
    process.exit(1);
}

// ================================
// STARTUP
// ================================

async function startBot() {
    try {
        // ================================
        // MONGODB
        // ================================

        await connectMongoDB();

        // ================================
        // LAVALINK
        // ================================

        client.lavalink = createMusicManager(client);

        // ================================
        // COMMANDS & EVENTS
        // ================================

        loadCommands(client);
        loadEvents(client);

        // ================================
        // DISCORD RAW EVENTS
        // ================================

        client.on("raw", (data) => {
            client.lavalink.sendRawData(data);
        });

        // ================================
        // LAVALINK EVENTS
        // ================================

        client.lavalink.nodeManager.on(
            "connect",
            (node) => {
                console.log(
                    `🟢 Lavalink connected: ${node.id}`
                );
            }
        );

        client.lavalink.nodeManager.on(
            "disconnect",
            (node, reason) => {
                console.log(
                    `🔴 Lavalink disconnected: ${node.id}`
                );

                if (reason) {
                    console.log(
                        "Reason:",
                        reason
                    );
                }
            }
        );

        client.lavalink.nodeManager.on(
            "error",
            (node, error, payload) => {
                console.error(
                    `❌ Lavalink error [${node.id}]`
                );

                console.error(error);

                if (payload) {
                    console.error(
                        "Payload:",
                        payload
                    );
                }
            }
        );

        client.lavalink.nodeManager.on(
            "reconnecting",
            (node) => {
                console.log(
                    `🔄 Lavalink reconnecting: ${node.id}`
                );
            }
        );

        // ================================
        // LOGIN
        // ================================

        await client.login(
            process.env.DISCORD_TOKEN
        );

    } catch (error) {
        console.error(
            "❌ Bot startup error:",
            error
        );

        process.exit(1);
    }
}

// ================================
// START BOT
// ================================

startBot();