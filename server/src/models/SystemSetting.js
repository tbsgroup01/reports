import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const SystemSetting = sequelize.define(
  "SystemSetting",
  {
    key: {
      type: DataTypes.STRING(100),
      primaryKey: true,
      allowNull: false,
    },
    value: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
  },
  {
    tableName: "system_settings",
    timestamps: true,
  }
);

export default SystemSetting;

