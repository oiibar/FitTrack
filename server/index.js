import express from "express";
import workoutRoutes from "./routes/workout.routes.js";
import userRoutes from "./routes/user.routes.js";
import mongoose from "mongoose";
import cors from "cors";

const PORT = 5000;
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["https://fit-track-gamma.vercel.app/api"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

//https://fit-track-cli.vercel.app

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   console.log(req.path, req.method);
//   next();
// });

app.use("/api/workouts", workoutRoutes);
app.use("/api/user", userRoutes);

mongoose
  .connect(
    "mongodb+srv://aibar:admin123@gym.hog70wj.mongodb.net/?retryWrites=true&w=majority&appName=Gym"
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
