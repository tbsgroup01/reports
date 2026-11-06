import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import sequelize from "./src/config/database.js";
import "./src/models/User.js";
import "./src/models/Report.js";
import "./src/models/SystemSetting.js";

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
    await sequelize.sync({ alter: true });

    app.listen(PORT, HOST, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
