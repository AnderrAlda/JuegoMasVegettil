import mongoose from "mongoose";

export async function connectDB() {
    if (!process.env.MONGODB_URL) {
        throw new Error("MONGODB_URL is not set");
    }

    await mongoose.connect(process.env.MONGODB_URL);
}