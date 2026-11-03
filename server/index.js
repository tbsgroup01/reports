import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import sequelize from "./src/config/database.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        console.log("MySQL connected successfully");

        app.listen(PORT, () => {
            console.log(`GLeaf Society reen Server running on port ${PORT}`);
            console.log(`API: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();