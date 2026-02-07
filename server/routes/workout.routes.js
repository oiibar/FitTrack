import express from "express";
import controllers from "../controllers/workout.controller.js";
import { Auth } from "../middleware/auth.js";
import { ensureOwnership } from "../middleware/authRole.js";
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

router.get("/stats", workoutStats);

router.get("/:id", ensureOwnership({ collection: 'workouts', idParam: 'id', allowAdmin: true }), getWorkout);

router.post("/", createWorkout);

router.put("/:id", ensureOwnership({ collection: 'workouts', idParam: 'id', allowAdmin: true }), updateWorkout);

router.patch("/:id/note", ensureOwnership({ collection: 'workouts', idParam: 'id', allowAdmin: true }), addNotes)

router.delete("/:id", ensureOwnership({ collection: 'workouts', idParam: 'id', allowAdmin: true }), softDeleteWorkout);

export default router;
