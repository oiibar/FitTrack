import { connectDB } from "../db/mongo.js";
import {ObjectId} from "mongodb";

export const Auth = async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const db = await connectDB();
    const user = await db.collection("users").findOne(
        { _id: new ObjectId(req.session.userId) },
        { projection: { _id: 1, email: 1, role: 1 } }
    );

    if (!user) {
      return res.status(401).json({ error: "Not authorized" });
    }

    req.user = {
      _id: new ObjectId(user._id),
      email: user.email,
      role: user.role || 'user'
    };

    next();
  } catch (error) {
    console.error("AuthPage middleware error:", error);
    res.status(401).json({ error: "Not authorized" });
  }
};
