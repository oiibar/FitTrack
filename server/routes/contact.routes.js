import express from "express";
import controllers from "../controllers/contact.controller.js";
const { contact } = controllers;

const router = express.Router();

router.post("/", contact);

export default router;
