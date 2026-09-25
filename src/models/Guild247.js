const mongoose = require("mongoose");

const guild247Schema = new mongoose.Schema(
    {
        guildId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        enabled: {
            type: Boolean,
            default: false
        },

        voiceChannelId: {
            type: String,
            required: true
        },

        textChannelId: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Guild247",
    guild247Schema
);