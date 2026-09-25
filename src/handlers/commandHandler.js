const fs = require("fs");
const path = require("path");

function loadCommands(client) {
    client.commands = new Map();

    const commandsPath = path.join(__dirname, "../commands");

    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);

        delete require.cache[require.resolve(filePath)];

        const command = require(filePath);

        if (!command.name || typeof command.execute !== "function") {
            console.warn(`⚠️ Invalid command file: ${file}`);
            continue;
        }

        client.commands.set(command.name, command);

        console.log(`📦 Loaded command: ${command.name}`);
    }
}

module.exports = { loadCommands };