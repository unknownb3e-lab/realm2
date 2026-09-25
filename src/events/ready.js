module.exports = {
    name: "clientReady",
    once: true,

    async execute(client) {
        console.log("");
        console.log("=================================");
        console.log(`🤖 Logged in as: ${client.user.tag}`);
        console.log(`🆔 Bot ID: ${client.user.id}`);
        console.log(`🌐 Servers: ${client.guilds.cache.size}`);
        console.log(`🎵 Prefix: ${process.env.PREFIX || ">"}`);
        console.log("=================================");
        console.log("");

        try {
            await client.lavalink.init({
                id: client.user.id,
                username: client.user.username
            });

            console.log("🎵 Lavalink manager initialized!");
        } catch (error) {
            console.error("❌ Failed to initialize Lavalink:");
            console.error(error);
        }
    }
};