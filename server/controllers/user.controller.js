import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { connectDB } from "../db/mongo.js";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET || "secretus", { expiresIn: "3d" });
};

const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Get fresh DB connection each time
    const db = await connectDB();
    const usersCollection = db.collection("users");

    // Check if user exists
    const exists = await usersCollection.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create user
    const user = {
      email,
      password: hash,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert user
    const result = await usersCollection.insertOne(user);

    // Create token
    const token = createToken(result.insertedId.toString());

    // Return response
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

    // Get fresh DB connection each time
    const db = await connectDB();
    console.log("Database connected:", !!db);

    const usersCollection = db.collection("users");
    console.log("Collection accessed:", !!usersCollection);

    // Find user
    const user = await usersCollection.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({
        success: false,
        error: "Invalid email or password"
      });
    }

    console.log("User found, checking password...");

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("Password mismatch for:", email);
      return res.status(401).json({
        success: false,
        error: "Invalid email or password"
      });
    }

    console.log("Password matched, creating token...");

    // Create token
    const token = createToken(user._id.toString());

    // Return response
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