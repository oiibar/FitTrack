import express from "express";
import controllers from "../controllers/items.controller.js";
const { items } = controllers;

const router = express.Router();

router.get("/:id", items);

export default router;
