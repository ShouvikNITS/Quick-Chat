import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        await mongoose.connect(`${uri}/chatapp`);
        console.log("MongoDB is connected");
    } catch (error) {
        console.log("MongoDB connection error:", error.message);
        throw error; // Optional: rethrow for upstream handling
    }
}