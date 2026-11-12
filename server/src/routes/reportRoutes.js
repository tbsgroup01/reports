import express from "express";
import {
  getUserProfile,
  saveMedicalReport,
  saveTelecomReport,
  getReports,
  getReportById,
  deleteReport,
  updateReport,
  getTodaysReport,
  updateQABatchStatus,
  getNextRecordNo,
  uploadUserDocument,
  documentUpload,
} from "../controllers/reportController.js";
import { getActiveMasterKeyPublic } from "../controllers/adminController.js";

const router = express.Router();

// Auto-generate next record number from database
router.get("/reports/next-record-no", getNextRecordNo);
router.get("/user/next-record-no/:userId", getNextRecordNo);
router.get("/user/next-record-no", getNextRecordNo);

// Upload User Document (separate per user)
router.post("/user/upload-document", documentUpload.single("file"), uploadUserDocument);
router.post("/reports/upload-document", documentUpload.single("file"), uploadUserDocument);

// Public active key route for operator download encryption
router.get("/master-key/active", getActiveMasterKeyPublic);
router.get("/user/master-key/active", getActiveMasterKeyPublic);

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

// Update Report (Both Admin & Operator)
router.put("/user/reports/:id", updateReport);
router.put("/reports/:id", updateReport);

// Delete Report
router.delete("/user/reports/:id", deleteReport);

export default router;

