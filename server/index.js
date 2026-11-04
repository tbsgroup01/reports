import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import sequelize from "./src/config/database.js";
import "./src/models/User.js"; // Ensure User model is registered for sync
import "./src/models/Report.js"; // Ensure Report model is registered for sync

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    console.log("MySQL connected and tables synced successfully");

    app.listen(PORT, () => {
      console.log(`Abdiva Infotech Server running on port ${PORT}`);
      console.log(`API URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
