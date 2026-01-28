import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { connectDB } from "../db/mongo.js";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

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
    const hash = await bcrypt.hash(password, salt);

    const user = {
      email,
      password: hash,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await usersCollection.insertOne(user);

    const token = createToken(result.insertedId.toString());

    res.status(201).json({
      success: true,
      email,
      token,
      id: result.insertedId
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
    console.log("Login attempt for:", email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required"
      });
    }

    const db = await connectDB();
    console.log("Database connected:", !!db);

    const usersCollection = db.collection("users");
    console.log("Collection accessed:", !!usersCollection);

    const user = await usersCollection.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({
        success: false,
        error: "Invalid email or password"
      });
    }

    console.log("User found, checking password...");

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("Password mismatch for:", email);
      return res.status(401).json({
        success: false,
        error: "Invalid email or password"
      });
    }

    console.log("Password matched, creating token...");

    const token = createToken(user._id.toString());

    res.status(200).json({
      success: true,
      email,
      token,
      id: user._id
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

export default {
  signup,
  login,
};