import express from "express";
import controllers from "../controllers/user.controller.js";
import { Auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/authRole.js";

const { login, signup, me, logout, listUsers, promoteUser } = controllers;
const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.get("/me", me);

router.use(Auth);
router.get("/users", requireRole('admin'), listUsers);
router.post("/users/:id/promote", requireRole('admin'), promoteUser);

export default router;
