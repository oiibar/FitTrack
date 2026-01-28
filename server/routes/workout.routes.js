import express from "express";
import controllers from "../controllers/workout.controller.js";
import { Auth } from "../middleware/auth.js";
const { createWorkout,
    getWorkouts,
    getWorkout,
    updateWorkout,
    searchWorkouts,
    addNotes,
    softDeleteWorkout,
    workoutStats } =
  controllers;

const router = express.Router();
router.use(Auth);

router.get('/search', searchWorkouts);

router.get("/", getWorkouts);

router.get("/:id", getWorkout);

router.post("/", createWorkout);

router.put("/:id", updateWorkout);

router.patch("/:id/note", addNotes)

router.get("/stats", workoutStats);

router.delete("/:id", softDeleteWorkout);

export default router;
