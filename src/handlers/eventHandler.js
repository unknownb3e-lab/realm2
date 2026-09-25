const fs = require("fs");
const path = require("path");

function loadEvents(client) {
    const eventsPath = path.join(__dirname, "../events");

    const eventFiles = fs
        .readdirSync(eventsPath)
        .filter(file => file.endsWith(".js"));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);

        delete require.cache[require.resolve(filePath)];

        const event = require(filePath);

        if (!event.name || typeof event.execute !== "function") {
            console.warn(`⚠️ Invalid event file: ${file}`);
            continue;
        }

        if (event.once) {
            client.once(event.name, (...args) => {
                event.execute(client, ...args);
            });
        } else {
            client.on(event.name, (...args) => {
                event.execute(client, ...args);
            });
        }

        console.log(`⚡ Loaded event: ${event.name}`);
    }
}

module.exports = { loadEvents };