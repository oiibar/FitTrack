import express from "express";
import controllers from "../controllers/workout.controller.js";
import { Auth } from "../middleware/Auth.js";
const { createWorkout, getWorkouts, getWorkout, deleteWorkout, updateWorkout, searchWorkouts } =
  controllers;

const router = express.Router();

router.use(Auth);

router.get('/search', searchWorkouts);

router.get("/", getWorkouts);

router.get("/:id", getWorkout);

router.post("/", createWorkout);

router.patch("/:id", updateWorkout);

router.delete("/:id", deleteWorkout);

export default router;
