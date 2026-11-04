import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Active SSE client connections for real-time updates
const sseClients = new Set();

/**
 * Safely parse badges from MySQL (which may return strings, arrays, or null)
 */
export const parseBadges = (rawBadges) => {
  if (Array.isArray(rawBadges)) return rawBadges;
  if (typeof rawBadges === "string") {
    try {
      const parsed = JSON.parse(rawBadges);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

/**
 * Standard operator formatter
 */
export const formatOperator = (op) => {
  return {
    id: op.id,
    username: op.username,
    email: op.email,
    password: op.plainPassword || (op.password ? "••••••••" : ""),
    hasPassword: !!op.password,
    showPassword: true,
    accessLevel: op.accessLevel || "Select Level",
    reportModel: op.reportModel || "Medical",
    status: op.status,
    accountStatus: op.accountStatus,
    dataStatus: op.dataStatus,
    deniedAccess: op.deniedAccess,
    badges: parseBadges(op.badges),
    totalReports: op.totalReports || 0,
    validRecords: op.validRecords || 0,
    deletedRecords: op.deletedRecords || 0,
    createdAt: op.createdAt,
    updatedAt: op.updatedAt,
  };
};

/**
 * Helper to fetch all formatted operators
 */
export const fetchAllOperatorsFormatted = async () => {
  const operators = await User.findAll({
    where: { role: "operator" },
    order: [["id", "ASC"]],
  });
  return operators.map(formatOperator);
};

/**
 * Broadcast real-time updates to all connected Admin clients via SSE
 */
export const broadcastOperatorsUpdate = async (eventType = "UPDATE", extraData = null) => {
  if (sseClients.size === 0) return;

  try {
    const operators = await fetchAllOperatorsFormatted();
    const payload = JSON.stringify({
      type: eventType,
      timestamp: new Date().toISOString(),
      operators,
      extra: extraData,
    });

    for (const client of sseClients) {
      client.write(`data: ${payload}\n\n`);
    }
  } catch (error) {
    console.error("Failed to broadcast real-time SSE update:", error);
  }
};

/**
 * Real-time SSE Stream Endpoint for Admin Panel
 * GET /api/admin/operators/stream
 */
export const streamOperators = async (req, res) => {
  // Set headers for Server-Sent Events
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  // Add this client to active listeners
  sseClients.add(res);

  // Send initial snapshot immediately
  try {
    const operators = await fetchAllOperatorsFormatted();
    res.write(
      `data: ${JSON.stringify({
        type: "INITIAL",
        timestamp: new Date().toISOString(),
        operators,
      })}\n\n`
    );
  } catch (err) {
    console.error("SSE initial data error:", err);
  }

  // Periodic heartbeat every 20 seconds to keep connection open
  const heartbeat = setInterval(() => {
    res.write(`: heartbeat\n\n`);
  }, 20000);

  // Clean up on disconnect
  req.on("close", () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
};

/**
 * 1. Get all operators
 * GET /api/admin/operators
 */
export const getOperators = async (req, res) => {
  try {
    const formatted = await fetchAllOperatorsFormatted();

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Get operators error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching operators.",
      error: error.message,
    });
  }
};

/**
 * 2. Set / Give Password to Operator from Admin Side
 * PUT /api/admin/operators/:id/password
 * Body: { password }
 */
export const setUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Password cannot be empty.",
      });
    }

    const operator = await User.findByPk(id);
    if (!operator) {
      return res.status(404).json({
        success: false,
        message: "Operator not found.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    operator.password = hashedPassword;
    operator.plainPassword = password;

    // If operator was Pending, set them to Active now that they have a password
    if (operator.status === "Pending") {
      operator.status = "Active";
      operator.accountStatus = "Active";
    }

    // Default to Medical or Telecom if still on Select Level
    if (operator.accessLevel === "Select Level") {
      operator.accessLevel = "Medical";
    }

    await operator.save();

    // Broadcast real-time update to all admin panels
    broadcastOperatorsUpdate("PASSWORD_SET", { operatorId: operator.id });

    return res.status(200).json({
      success: true,
      message: `Password assigned to operator ${operator.username}. They can now log in.`,
      operator: formatOperator(operator),
    });
  } catch (error) {
    console.error("Set password error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error setting operator password.",
      error: error.message,
    });
  }
};

/**
 * 3. Update Access Level
 * PUT /api/admin/operators/:id/access-level
 * Body: { accessLevel }
 */
export const updateAccessLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const { accessLevel } = req.body;

    const operator = await User.findByPk(id);
    if (!operator) {
      return res.status(404).json({ success: false, message: "Operator not found." });
    }

    operator.accessLevel = accessLevel;
    await operator.save();

    // Broadcast real-time update
    broadcastOperatorsUpdate("ACCESS_LEVEL_CHANGED", { operatorId: operator.id, accessLevel });

    return res.status(200).json({
      success: true,
      message: "Access level updated.",
      data: { id: operator.id, accessLevel: operator.accessLevel },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. Grant Access
 * POST /api/admin/operators/:id/grant-access
 */
export const grantAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const operator = await User.findByPk(id);
    if (!operator) return res.status(404).json({ success: false, message: "Operator not found." });

    operator.status = "Active";
    operator.accountStatus = "Active";
    operator.deniedAccess = "No";
    await operator.save();

    // Broadcast real-time update
    broadcastOperatorsUpdate("ACCESS_GRANTED", { operatorId: operator.id });

    return res.status(200).json({ success: true, message: "Access granted.", operator: formatOperator(operator) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 5. Deny Access
 * POST /api/admin/operators/:id/deny-access
 */
export const denyAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const operator = await User.findByPk(id);
    if (!operator) return res.status(404).json({ success: false, message: "Operator not found." });

    operator.status = "Denied";
    operator.accountStatus = "Denied";
    operator.deniedAccess = "Yes";
    await operator.save();

    // Broadcast real-time update
    broadcastOperatorsUpdate("ACCESS_DENIED", { operatorId: operator.id });

    return res.status(200).json({ success: true, message: "Access denied.", operator: formatOperator(operator) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 6. Toggle Freeze
 * POST /api/admin/operators/:id/toggle-freeze
 */
export const toggleFreeze = async (req, res) => {
  try {
    const { id } = req.params;
    const operator = await User.findByPk(id);
    if (!operator) return res.status(404).json({ success: false, message: "Operator not found." });

    let currentBadges = parseBadges(operator.badges);

    if (operator.status === "Frozen" || currentBadges.includes("FROZEN")) {
      operator.status = "Active";
      operator.accountStatus = "Active";
      currentBadges = currentBadges.filter((b) => b !== "FROZEN");
    } else {
      operator.status = "Frozen";
      operator.accountStatus = "Frozen";
      if (!currentBadges.includes("FROZEN")) currentBadges.push("FROZEN");
    }

    operator.badges = currentBadges;
    await operator.save();

    // Broadcast real-time update
    broadcastOperatorsUpdate("FREEZE_TOGGLED", { operatorId: operator.id });

    return res.status(200).json({
      success: true,
      message: `Operator is now ${operator.status}.`,
      status: operator.status,
      badges: operator.badges,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 7. Toggle Jumble
 * POST /api/admin/operators/:id/toggle-jumble
 */
export const toggleJumble = async (req, res) => {
  try {
    const { id } = req.params;
    const operator = await User.findByPk(id);
    if (!operator) return res.status(404).json({ success: false, message: "Operator not found." });

    let currentBadges = parseBadges(operator.badges);

    if (currentBadges.includes("JUMBLED")) {
      currentBadges = currentBadges.filter((b) => b !== "JUMBLED");
    } else {
      currentBadges.push("JUMBLED");
    }

    operator.badges = currentBadges;
    await operator.save();

    // Broadcast real-time update
    broadcastOperatorsUpdate("JUMBLE_TOGGLED", { operatorId: operator.id });

    return res.status(200).json({
      success: true,
      message: `Jumble mode ${currentBadges.includes("JUMBLED") ? "enabled" : "disabled"}.`,
      badges: operator.badges,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 8. Delete Operator
 * DELETE /api/admin/operators/:id
 */
export const deleteOperator = async (req, res) => {
  try {
    const { id } = req.params;
    const operator = await User.findByPk(id);
    if (!operator) return res.status(404).json({ success: false, message: "Operator not found." });

    await operator.destroy();

    // Broadcast real-time update
    broadcastOperatorsUpdate("OPERATOR_DELETED", { operatorId: id });

    return res.status(200).json({ success: true, message: "Operator deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 9. Admin Directly Add Operator
 * POST /api/admin/operators
 * Body: { username, email, password, accessLevel, status }
 */
export const createOperator = async (req, res) => {
  try {
    const { username, email, password, accessLevel, status } = req.body;

    if (!username || !email) {
      return res.status(400).json({
        success: false,
        message: "Username and email are required.",
      });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    let hashedPassword = null;
    let plainPassword = null;

    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
      plainPassword = password;
    }

    const newOperator = await User.create({
      username,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      plainPassword,
      role: "operator",
      accessLevel: accessLevel || "Medical",
      reportModel: accessLevel === "Telecom" ? "Telecom" : "Medical",
      status: status || (hashedPassword ? "Active" : "Pending"),
      accountStatus: status || (hashedPassword ? "Active" : "Pending"),
      dataStatus: "Clean",
      deniedAccess: "No",
      badges: [],
    });

    // Broadcast real-time update
    broadcastOperatorsUpdate("OPERATOR_CREATED", { operatorId: newOperator.id });

    return res.status(201).json({
      success: true,
      message: "Operator created successfully.",
      data: formatOperator(newOperator),
    });
  } catch (error) {
    console.error("Create operator error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error creating operator.",
      error: error.message,
    });
  }
};
