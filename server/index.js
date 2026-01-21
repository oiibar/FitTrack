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

const allowedOrigins = [
    "https://fit-track-gamma.vercel.app",
    "http://localhost:3000"
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use("/api/workouts", workoutRoutes);
app.use("/api/user", userRoutes);
app.use("/api/contact", contactRoutes)
app.use("/api/info", infoRoutes)
app.use("/api/search", searchRoutes);
app.use("/api/items", itemsRoutes);

app.get("/", (req, res) => {
    res.json({ message: "API is running" });
});

app.use((err, req, res, next) => {
    if (err.message.includes('CORS')) {
        res.status(403).json({ error: err.message });
    } else {
        next(err);
    }
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}).catch((err) => {
    console.log(err);
});

export default app;