import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Report = sequelize.define(
  "Report",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    level: {
      type: DataTypes.ENUM("medical", "telecom"),
      allowNull: false,
      defaultValue: "medical",
    },
    fileNo: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    recordNo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    refNo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    entryDate: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    invoiceNo: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    conNo: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    accountNo: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    customerName: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    agentName: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    creditCardNo: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    total: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    netAmount: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: "Digitized",
    },
    // Store complete form payload with all 32+ custom domain fields & product arrays
    data: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
    },
  },
  {
    tableName: "reports",
    timestamps: true,
  }
);

// Define associations
User.hasMany(Report, { foreignKey: "userId", as: "reports" });
Report.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Report;

