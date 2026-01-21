import express from "express";
import controllers from "../controllers/search.controller.js";
const { search } = controllers;

const router = express.Router();

router.get("/", search);

export default router;
