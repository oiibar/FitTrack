import express from "express";
import controllers from "../controllers/user.controller.js";
const { login, signup } = controllers;

const router = express.Router();

router.post("/login", login);

router.post("/signup", signup);

export default router;
