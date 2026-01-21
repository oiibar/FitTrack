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

const createToken = (_id) => {
  return jwt.sign({ _id }, "secretus", { expiresIn: "3d" });
};


const signup = async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const db = await connectDB();
    const usersCollection = db.collection("users");

    const exists = await usersCollection.findOne({ email });
    if (exists) {
      throw new Error("Email already in use");
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

    res.status(200).json({
      email,
      token
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const login = async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const db = await connectDB();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });
    if (!user) {
      throw new Error("Incorrect email");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("Incorrect password");
    }

    const token = createToken(user._id.toString());

    res.status(200).json({
      email,
      token
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  signup,
  login,
};
