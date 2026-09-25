module.exports = {
    name: "clientReady",

    async execute(client) {
        try {
            console.log("🤖 Discord client ready!");

            // ==========================================
            // DISABLE ALL 24/7 SERVERS ON STARTUP
            // ==========================================

            const Guild247 = require("../models/Guild247");

            await Guild247.updateMany(
                { enabled: true },
                { $set: { enabled: false } }
            );

            console.log("🔓 Disabled all 24/7 servers on startup.");

        } catch (error) {
            console.error("❌ Client ready error:", error);
        }
    }
};
