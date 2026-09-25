const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    guildId: {
        type: String,
        required: true,
        index: true
    },
    trackEncoded: {
        type: String,
        required: true
    },
    trackIdentifier: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    artworkUrl: {
        type: String,
        default: null
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

favoriteSchema.index({ userId: 1, trackIdentifier: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
