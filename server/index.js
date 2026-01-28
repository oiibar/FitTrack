import express from "express";
import workoutRoutes from "./routes/workout.routes.js";
import userRoutes from "./routes/user.routes.js";
import cors from "cors";
import contactRoutes from "./routes/contact.routes.js";
import infoRoutes from "./routes/info.routes.js";
import { connectDB } from "./db/mongo.js";

const PORT = process.env.PORT || 4000;
const app = express();

const allowedOrigins = [
    "https://fit-track-gamma.vercel.app",
    "http://localhost:3000"
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body || "");
    next();
});

app.use("/api/workouts", workoutRoutes);
app.use("/api/user", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/info", infoRoutes);

app.get("/api/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/api/test-cors", (req, res) => {
    res.json({ message: "CORS test successful", origin: req.headers.origin });
});

app.use((err, req, res, next) => {
    console.error(err.stack);

    if (err.message.includes('CORS')) {
        return res.status(403).json({
            error: "CORS Error",
            message: err.message,
            allowedOrigins
        });
    }

    res.status(500).json({
        error: "Internal Server Error",
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Allowed origins: ${allowedOrigins.join(", ")}`);
    });
}).catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
});

export default app;