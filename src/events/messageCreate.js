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
                        "ðŸš« Ø£Ù†Øª Ù…Ø­Ø¸ÙˆØ± Ù…Ù† Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø£ÙˆØ§Ù…Ø± anas."
                    ).catch(() => {});
                }
            } catch (error) {
                console.error(
                    "âŒ Blacklist check error:",
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
                `âŒ ${commandName} command error:`,
                error
            );

            if (!message.channel) return;

            await message.channel
                .send(
                    "âŒ ØµØ§Ø± ÙÙŠ Ø®Ø·Ø£ ÙˆØ­Ù†Ø§ Ù†Ù†ÙØ° Ù‡Ø°Ø§ Ø§Ù„Ø£Ù…Ø±."
                )
                .catch(() => {});
        }
    }
};
