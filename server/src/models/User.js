import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true, // Nullable until admin sets it for regular operators
    },
    plainPassword: {
      type: DataTypes.STRING(255),
      allowNull: true, // For admin to view/manage as displayed in Operator Management table
    },
    role: {
      type: DataTypes.ENUM("admin", "operator"),
      defaultValue: "operator",
    },
    accessLevel: {
      type: DataTypes.ENUM("Medical", "Telecom", "Both", "Select Level"),
      defaultValue: "Medical",
    },
    reportModel: {
      type: DataTypes.STRING(50),
      defaultValue: "Medical",
    },
    status: {
      type: DataTypes.ENUM("Pending", "Active", "Frozen", "Denied"),
      defaultValue: "Pending",
    },
    accountStatus: {
      type: DataTypes.STRING(50),
      defaultValue: "Pending",
    },
    dataStatus: {
      type: DataTypes.STRING(50),
      defaultValue: "Clean",
    },
    deniedAccess: {
      type: DataTypes.STRING(10),
      defaultValue: "No",
    },
    badges: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    totalReports: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    validRecords: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    deletedRecords: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

export default User;

