import bcrypt from "bcrypt";
import { connectDB } from "../db/mongo.js";
import {ObjectId} from "mongodb";

const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const db = await connectDB();
    const usersCollection = db.collection("users");

    const exists = await usersCollection.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      email: email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await usersCollection.insertOne(user);
    req.session.userId = new ObjectId(result.insertedId);

    res.status(201).json({
      success: true,
      email,
      id: new ObjectId(result.insertedId)
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required"
      });
    }

    const db = await connectDB();
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({
        success: false,
        error: "Invalid email or password"
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("Password mismatch for:", email);
      return res.status(401).json({
        success: false,
        error: "Invalid email or password"
      });
    }

    req.session.userId = user._id;

    res.status(200).json({
      success: true,
      email,
      id: new ObjectId(user._id)
    });

  } catch (error) {
    console.error("Login error details:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const me = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const db = await connectDB();
    const user = await db.collection("users").findOne(
        { _id: new ObjectId(req.session.userId) },
        { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.status(200).json({
      id: user._id,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.status(200).json({ success: true });
    } catch (error) {
      console.error("Logout error details:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
}

export default {
  signup,
  login,
  me,
  logout
};