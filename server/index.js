import dotenv from "dotenv";
import express from "express";
import workoutRoutes from "./routes/workout.routes.js";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [""],
    methods: ["POST", "GET", "DELETE"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/workouts", workoutRoutes);

mongoose
  .connect('mongodb+srv://aibar:admin123@gym.hog70wj.mongodb.net/?retryWrites=true&w=majority&appName=Gym')
  .then(() => {
    app.listen(5000, () => {
      console.log(`Listening on port 5000`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
