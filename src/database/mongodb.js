const mongoose = require("mongoose");

async function connectMongoDB() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error(
                "MONGODB_URI is missing from .env"
            );
        }

        await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log("🟢 MongoDB connected!");
    } catch (error) {
        console.error(
            "❌ MongoDB connection error:",
            error
        );

        process.exit(1);
    }
}

module.exports = {
    connectMongoDB
};