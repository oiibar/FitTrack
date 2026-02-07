import bcrypt from "bcrypt";
import { connectDB } from "../db/mongo.js";
import {ObjectId} from "mongodb";

const signup = async (req, res) => {
  const { email, password, adminCode } = req.body;

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

    // Determine role. Only server decides role; client cannot set arbitrary roles.
    let role = 'user';
    if (adminCode && process.env.ADMIN_CODE && adminCode === process.env.ADMIN_CODE) {
      role = 'admin';
    }

    const user = {
      email: email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await usersCollection.insertOne(user);
    req.session.userId = new ObjectId(result.insertedId);

    res.status(201).json({
      success: true,
      email,
      id: new ObjectId(result.insertedId),
      role
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
      id: new ObjectId(user._id),
      role: user.role || 'user'
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
      role: user.role || 'user'
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Admin-only: list all users (without passwords)
const listUsers = async (req, res) => {
  try {
    const db = await connectDB();
    const users = await db.collection('users').find({}, { projection: { password: 0 } }).toArray();
    res.status(200).json(users);
  } catch (error) {
    console.error('listUsers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin-only: change user's role
const promoteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // expected 'user' or 'admin'

    if (!ObjectId.isValid(id)) return res.status(404).json({ error: 'User not found' });
    if (!role || (role !== 'user' && role !== 'admin')) return res.status(400).json({ error: 'Invalid role' });

    const db = await connectDB();
    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { role, updatedAt: new Date() } },
      { projection: { password: 0 }, returnDocument: 'after' }
    );

    if (!result.value) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(result.value);
  } catch (error) {
    console.error('promoteUser error:', error);
    res.status(500).json({ error: 'Server error' });
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
  logout,
  listUsers,
  promoteUser
};