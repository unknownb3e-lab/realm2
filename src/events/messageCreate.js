const Blacklist = require("../models/Blacklist");

module.exports = {
    name: "messageCreate",

    async execute(client, message) {
        // Ignore bots
        if (message.author.bot) return;

        const prefix =
            process.env.PREFIX || ">";

        // Ignore messages without prefix
        if (!message.content.startsWith(prefix)) {
            return;
        }

        const args = message.content
            .slice(prefix.length)
            .trim()
            .split(/\s+/);

        const commandName =
            args.shift()?.toLowerCase();

        if (!commandName) return;

        const command =
            client.commands.get(commandName);

        if (!command) return;

        // ==========================================
        // OWNER BYPASS
        // ==========================================

        const ownerId =
            process.env.OWNER_ID;

        const isOwner =
            ownerId &&
            message.author.id === ownerId;

        // ==========================================
        // BLACKLIST CHECK
        // ==========================================

        if (!isOwner) {
            try {
                const blacklisted =
                    await Blacklist.exists({
                        userId: message.author.id
                    });

                if (blacklisted) {
                    return message.reply(
                        "🚫 أنت محظور من استخدام أزˆامر anas."
                    ).catch(() => {});
                }
            } catch (error) {
                console.error(
                    "❌ Blacklist check error:",
                    error
                );

                return;
            }
        }

        // ==========================================
        // EXECUTE COMMAND
        // ==========================================

        try {
            await command.execute({
                client,
                message,
                args
            });
        } catch (error) {
            console.error(
                `❌ ${commandName} command error:`,
                error
            );

            if (!message.channel) return;

            await message.channel
                .send(
                    "❌ صار في خطأ وحنا ننفذ هذا الأمر."
                )
                .catch(() => {});
        }
    }
};
