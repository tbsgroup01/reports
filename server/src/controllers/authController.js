import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import User from "../models/User.js";
import { broadcastOperatorsUpdate } from "./adminController.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "replace_with_a_long_random_secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};

/**
 * 1. Admin Registration (via Postman)
 * POST /api/auth/admin/register
 * Body: { email, password, name? }
 */
export const registerAdmin = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await User.create({
      username: name || "Admin",
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      plainPassword: password, // For easy administration preview
      role: "admin",
      accessLevel: "Both",
      status: "Active",
      accountStatus: "Active",
      badges: [],
    });

    const token = generateToken(admin);

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully.",
      token,
      data: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during admin registration.",
      error: error.message,
    });
  }
};

/**
 * 2. User / Operator Registration (from UI or Postman)
 * POST /api/auth/user/register
 * Body: { fullName (or name/username), email }
 */
export const registerUser = async (req, res) => {
  try {
    const { fullName, name, username, email } = req.body;
    const resolvedUsername = (fullName || name || username || "").trim();
    const resolvedEmail = (email || "").trim().toLowerCase();

    if (!resolvedUsername || !resolvedEmail) {
      return res.status(400).json({
        success: false,
        message: "Full name and email are required for operator registration.",
      });
    }

    const existingUser = await User.findOne({ where: { email: resolvedEmail } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({
      username: resolvedUsername,
      email: resolvedEmail,
      password: null, // Left empty until Admin assigns a password
      plainPassword: null,
      role: "operator",
      accessLevel: "Select Level",
      status: "Pending",
      accountStatus: "Pending",
      dataStatus: "Clean",
      deniedAccess: "No",
      badges: [],
    });

    // Notify all connected Admin dashboards in real-time
    broadcastOperatorsUpdate("USER_REGISTERED", {
      id: user.id,
      username: user.username,
      email: user.email,
    });

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Your account has been submitted. An administrator must assign your password before you can log in.",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("User registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during user registration.",
      error: error.message,
    });
  }
};

/**
 * 3. Login (Admin & User/Operator with Username OR Email)
 * POST /api/auth/login
 * Body: { identifier (or email / username), password }
 */
export const login = async (req, res) => {
  try {
    const identifier = (
      req.body.identifier ||
      req.body.email ||
      req.body.username ||
      ""
    ).trim();
    const { password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Username/Email and password are required.",
      });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier.toLowerCase() },
          { username: identifier },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username/email or password.",
      });
    }

    if (!user.password) {
      return res.status(403).json({
        success: false,
        message:
          "Account pending admin approval: An administrator has not assigned your password yet. Please contact your admin.",
      });
    }

    if (user.status === "Denied" || user.deniedAccess === "Yes") {
      return res.status(403).json({
        success: false,
        message: "Access Denied: Your account access has been revoked by an administrator.",
      });
    }

    if (user.status === "Frozen") {
      return res.status(403).json({
        success: false,
        message: "Account Frozen: Your account has been frozen by an administrator.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        accessLevel: user.accessLevel,
        reportModel: user.reportModel,
        status: user.status,
        badges: user.badges || [],
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login.",
      error: error.message,
    });
  }
};

/**
 * 4. Get Current User Info
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching user profile.",
      error: error.message,
    });
  }
};

