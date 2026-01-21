import express from "express";
import workoutRoutes from "./routes/workout.routes.js";
import userRoutes from "./routes/user.routes.js";
import mongoose from "mongoose";
import cors from "cors";
import contactRoutes from "./routes/contact.routes.js";
import infoRoutes from "./routes/info.routes.js";
import searchRoutes from "./routes/search.routes.js";
import itemsRoutes from "./routes/items.routes.js";
import {connectDB} from "./db/mongo.js";

const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use(
  cors({
    // origin: "https://fit-track-gamma.vercel.app",
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ["Content-Type", "Authorization"],
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
app.use("/api/contact", contactRoutes)
app.use("/api/info", infoRoutes)
app.use("/api/search", searchRoutes);
app.use("/api/items", itemsRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}).catch((err) => {
    console.log(err);
});

// mongoose
//   .connect(
//       "mongodb+srv://quovein_db_user:rcFEmdlyJb4hMmzG@gym.ven5pd1.mongodb.net/?retryWrites=true&w=majority&appName=Gym"
//   )
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Listening on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });

export default app;
