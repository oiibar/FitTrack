// import User from "../models/user.model.js";
// import jwt from "jsonwebtoken";
//
// const createToken = (_id) => {
//   return jwt.sign({ _id }, "secretus", { expiresIn: "3d" });
// };
//
// const signup = async (req, res) => {
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   const { email, password } = req.body;
//
//   try {
//     const user = await User.signup(email, password);
//     const token = createToken(user._id);
//     res.status(200).json({ email, token });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
//
// const login = async (req, res) => {
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   const { email, password } = req.body;
//
//   try {
//     const user = await User.login(email, password);
//     const token = createToken(user._id);
//     res.status(200).json({ email, token });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
//
// export default {
//   login,
//   signup,
// };

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { connectDB } from "../db/mongo.js";

// Initialize database connection once
let db;
(async () => {
  try {
    db = await connectDB();
    console.log("Database connected in user controller");
  } catch (error) {
    console.error("Failed to connect to database:", error);
  }
})();

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
      email,
      token,
      id: result.insertedId
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = createToken(user._id.toString());

    res.status(200).json({
      email,
      token,
      id: user._id
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  signup,
  login,
};
