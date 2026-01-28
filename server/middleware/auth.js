import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { connectDB } from "../db/mongo.js";

export const Auth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Missing authorization token" });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secretus");

    const db = await connectDB();
    const user = await db.collection("users").findOne(
        { _id: new ObjectId(decoded._id) },
        { projection: { _id: 1 } }
    );

    if (!user) {
      return res.status(401).json({ error: "Not authorized" });
    }

    req.user = { _id: user._id.toString() };

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Not authorized" });
  }
};
