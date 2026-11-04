import express from "express";
import {
  getUserProfile,
  saveMedicalReport,
  saveTelecomReport,
  getReports,
  getReportById,
  deleteReport,
  getTodaysReport,
  updateQABatchStatus,
} from "../controllers/reportController.js";

const router = express.Router();

// Operator Profile & Live Access
router.get("/user/get-a-user/:id", getUserProfile);

// Save Reports to MySQL in Real Time
router.post("/medical/medical-report", saveMedicalReport);
router.post("/user/medical-report", saveMedicalReport);
router.post("/telecom/telecom-report", saveTelecomReport);
router.post("/user/telecom-report", saveTelecomReport);

// Query Reports (Search, Pagination, Level)
router.get("/user/get-reports/:id", getReports);
router.get("/reports/:level/:id", getReports);
router.get("/reports/detail/:id", getReportById);

// Today's Reports (Backup)
router.get("/user/todays-report/:id", getTodaysReport);

// Quality Assurance (QA) Checkpoint - Batch Verification Status & Audit
router.put("/user/qa-batch-status", updateQABatchStatus);
router.put("/reports/qa-batch-status", updateQABatchStatus);

// Delete Report
router.delete("/user/reports/:id", deleteReport);

export default router;

