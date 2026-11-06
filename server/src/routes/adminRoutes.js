import express from "express";
import {
  getOperators,
  streamOperators,
  setUserPassword,
  updateAccessLevel,
  grantAccess,
  denyAccess,
  toggleFreeze,
  toggleJumble,
  deleteOperator,
  createOperator,
  getMasterKeySettings,
  updateMasterKeySettings,
  getActiveMasterKeyPublic,
} from "../controllers/adminController.js";

const router = express.Router();

// Real-time SSE Stream route for live updates
router.get("/operators/stream", streamOperators);

// Master Decryption Key Vault routes
router.get("/master-key", getMasterKeySettings);
router.put("/master-key", updateMasterKeySettings);
router.get("/master-key/active", getActiveMasterKeyPublic);

// Operator routes
router.get("/operators", getOperators);
router.post("/operators", createOperator);

// Assign or Reset password from admin side
router.put("/operators/:id/password", setUserPassword);
router.patch("/operators/:id/password", setUserPassword);

// Modify access level & controls
router.put("/operators/:id/access-level", updateAccessLevel);
router.post("/operators/:id/grant-access", grantAccess);
router.post("/operators/:id/deny-access", denyAccess);
router.post("/operators/:id/toggle-freeze", toggleFreeze);
router.post("/operators/:id/toggle-jumble", toggleJumble);
router.delete("/operators/:id", deleteOperator);

export default router;

