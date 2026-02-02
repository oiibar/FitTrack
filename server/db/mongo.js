import { MongoClient } from "mongodb";
import { config } from "dotenv";

config();
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    throw new Error('Please define the MONGO_URI environment variable');
}

let cached = global.mongo;
if (!cached) {
    cached = global.mongo = { client: null, promise: null, db: null };
}

export async function connectDB() {
    if (cached.db) {
        return cached.db;
    }

    if (!cached.promise) {
        cached.promise = MongoClient.connect(MONGO_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        }).then((client) => {
            return {
                client,
                db: client.db("FitTrack"),
            };
        });
    }

    try {
        const { client, db } = await cached.promise;
        await client.db().admin().ping();
        cached.db = db;
        console.log("MongoDB connected successfully");
        return db;
    } catch (error) {
        cached.promise = null;
        console.error("Failed to connect to MongoDB:", error);
        throw error;
    }
}