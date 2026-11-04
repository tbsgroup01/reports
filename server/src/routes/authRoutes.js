import express from "express";
import {
  registerAdmin,
  registerUser,
  login,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// 1. Admin Registration (via Postman)
router.post("/admin/register", registerAdmin);

// 2. User / Operator Registration (from UI or Postman)
router.post("/user/register", registerUser);
router.post("/register", registerUser); // Alias for convenience

// 3. Login for both Admin and Operator
router.post("/login", login);

// 4. Current user details (protected)
router.get("/me", protect, getMe);

export default router;

