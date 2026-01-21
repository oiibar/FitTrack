import express from "express";
import controllers from "../controllers/info.controller.js";
const { info } = controllers;

const router = express.Router();

router.get("/", info);

export default router;
