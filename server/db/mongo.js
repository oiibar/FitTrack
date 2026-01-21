import { MongoClient } from "mongodb";
import { config } from "dotenv";

config();

const MONGO_URI = process.env.MONGO_URI;

const client = new MongoClient(MONGO_URI);

let db;

export async function connectDB() {
    if (!db) {
        await client.connect();
        db = client.db("gym");
        console.log("MongoDB connected");
    }
    return db;
}
