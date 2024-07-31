import dotenv from "dotenv";
import express from "express";
import workoutRoutes from "./routes/workout.routes.js";
import userRoutes from "./routes/user.routes.js";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["https://gym-cli.onrender.com"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/workouts", workoutRoutes);
app.use("/api/user", userRoutes);

mongoose
  .connect(
    "mongodb+srv://aibar:admin123@gym.hog70wj.mongodb.net/?retryWrites=true&w=majority&appName=Gym"
  )
  .then(() => {
    app.listen(5000, () => {
      console.log(`Listening on port 5000`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
