import express from "express";
import controllers from "../controllers/user.controller.js";

const { login, signup, me, logout } = controllers;
const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.get("/me", me);

export default router;
