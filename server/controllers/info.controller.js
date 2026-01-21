const info = async (req, res) => {
    try {
        const projectInfo = {
            name: "FitTrack Workout Tracker",
            version: "1.0.0",
            description: "A RESTful API built with Express.js",
            status: "running",
            environment: process.env.NODE_ENV || "development",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            endpoints: {
                info: "/api/info",
                users: "/api/users",
                workouts: "/api/workouts",
                contact: "/api/contact",
            },
            technologies: [
                "Node.js",
                "Express.js",
                "JavaScript/ES6+"
            ]
        };

        res.status(200).json({
            success: true,
            data: projectInfo,
            message: "Project information retrieved successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export default {
    info,
};