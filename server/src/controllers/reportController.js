import { Op } from "sequelize";
import Report from "../models/Report.js";
import User from "../models/User.js";
import { broadcastOperatorsUpdate, parseBadges } from "./adminController.js";

export const parseReportData = (raw) => {
  if (!raw) return {};
  if (typeof raw === "object") return raw;
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch (e) {
    return {};
  }
};

/**
 * 1. Get User Profile for Operator Portal
 * GET /api/v1/user/get-a-user/:id
 */
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const badges = parseBadges(user.badges);
    const jumbleUpReports = badges.includes("JUMBLED");
    const isFrozen = user.status === "Frozen" || badges.includes("FROZEN");

    const userData = {
      _id: user.id,
      id: user.id,
      username: user.username,
      name: user.username,
      email: user.email,
      role: user.role,
      accessLevel: user.accessLevel || "Medical",
      reportModel: user.reportModel || "Medical",
      status: user.status,
      accountStatus: user.accountStatus,
      deniedAccess: user.deniedAccess === "Yes",
      isFrozen,
      jumbleUpReports,
      duplicateReport: badges.includes("DUPLICATE") || false,
      badges,
      totalReports: user.totalReports || 0,
      validRecords: user.validRecords || 0,
      deletedRecords: user.deletedRecords || 0,
      createdAt: user.createdAt,
    };

    return res.status(200).json({
      success: true,
      data: [userData],
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2. Save Medical Report
 * POST /api/v1/medical/medical-report
 * POST /api/v1/user/medical-report
 */
export const saveMedicalReport = async (req, res) => {
  try {
    const userId = req.body.userId || req.user?.id || 1;
    const {
      fileNo,
      recordNo,
      refNo,
      entryDate,
      invoiceNo,
      accountNo,
      customerName,
      agentName,
      creditCardNo,
      total,
      netAmount,
      status,
    } = req.body;

    if (!recordNo) {
      return res.status(400).json({ success: false, message: "Record No is required." });
    }

    // Save report to MySQL
    const report = await Report.create({
      userId,
      level: "medical",
      fileNo: fileNo || "1",
      recordNo,
      refNo: refNo || `Mb_Sales-Med-Np#-l44604#1I @as-PUC1a#- ${recordNo}`,
      entryDate: entryDate || new Date().toISOString().split("T")[0],
      invoiceNo: invoiceNo || "SP-l7700IOOI",
      accountNo: accountNo || "",
      customerName: customerName || "",
      agentName: agentName || "",
      creditCardNo: creditCardNo || "",
      total: total || "0.00",
      netAmount: netAmount || "0.00",
      status: status || "Digitized",
      data: req.body,
    });

    // Update user stats
    const user = await User.findByPk(userId);
    if (user) {
      user.totalReports = (user.totalReports || 0) + 1;
      user.validRecords = (user.validRecords || 0) + 1;
      await user.save();
    }

    // Broadcast update to real-time Admin side
    broadcastOperatorsUpdate("REPORT_SAVED", { userId, level: "medical", reportId: report.id });

    return res.status(201).json({
      success: true,
      message: "Medical report saved to database successfully.",
      data: report,
    });
  } catch (error) {
    console.error("Error saving medical report:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3. Save Telecom Report
 * POST /api/v1/telecom/telecom-report
 */
export const saveTelecomReport = async (req, res) => {
  try {
    const userId = req.body.userId || req.user?.id || 1;
    const {
      fileNo,
      recordNo,
      refNo,
      entryDate,
      invoiceNo,
      phoneNo,
      custName,
      agentName,
      creditCardNo,
      phoneCost,
      balance,
      status,
    } = req.body;

    if (!recordNo) {
      return res.status(400).json({ success: false, message: "Record No is required." });
    }

    const report = await Report.create({
      userId,
      level: "telecom",
      fileNo: fileNo || "TC_Telecom_Batch_01",
      recordNo,
      refNo: refNo || `TC-REF-${recordNo}`,
      entryDate: entryDate || new Date().toISOString().split("T")[0],
      invoiceNo: invoiceNo || "TC_vd-Sdi-IB-BtunVp-00",
      accountNo: req.body.accountNo || "",
      customerName: req.body.customerName || custName || "",
      agentName: agentName || "",
      creditCardNo: creditCardNo || "",
      total: req.body.total || phoneCost || balance || "0.00",
      netAmount: req.body.netAmount || phoneCost || balance || "0.00",
      status: status || "Digitized",
      data: req.body,
    });

    const user = await User.findByPk(userId);
    if (user) {
      user.totalReports = (user.totalReports || 0) + 1;
      user.validRecords = (user.validRecords || 0) + 1;
      await user.save();
    }

    broadcastOperatorsUpdate("REPORT_SAVED", { userId, level: "telecom", reportId: report.id });

    return res.status(201).json({
      success: true,
      message: "Telecom report saved to database successfully.",
      data: report,
    });
  } catch (error) {
    console.error("Error saving telecom report:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. Get Reports (Supports pagination, search, level)
 * GET /api/v1/user/get-reports/:id
 * GET /api/v1/reports/:level/:id
 */
export const getReports = async (req, res) => {
  try {
    const { id } = req.params;
    const { level, page = 1, limit = 10, search = "", startDate, endDate, date } = req.query;

    const whereClause = {};

    // Filter by user if not admin "all"
    if (id && id !== "all") {
      whereClause.userId = id;
    }

    // Filter by level (medical or telecom)
    if (level && level !== "all") {
      whereClause.level = level.toLowerCase();
    }

    // Date range filtering
    if (startDate && endDate) {
      whereClause[Op.or] = [
        { entryDate: { [Op.between]: [startDate, endDate] } },
        {
          createdAt: {
            [Op.between]: [
              new Date(`${startDate}T00:00:00.000Z`),
              new Date(`${endDate}T23:59:59.999Z`),
            ],
          },
        },
      ];
    } else if (startDate) {
      whereClause[Op.or] = [
        { entryDate: { [Op.gte]: startDate } },
        { createdAt: { [Op.gte]: new Date(`${startDate}T00:00:00.000Z`) } },
      ];
    } else if (endDate) {
      whereClause[Op.or] = [
        { entryDate: { [Op.lte]: endDate } },
        { createdAt: { [Op.lte]: new Date(`${endDate}T23:59:59.999Z`) } },
      ];
    } else if (date) {
      whereClause[Op.or] = [
        { entryDate: date },
        {
          createdAt: {
            [Op.between]: [
              new Date(`${date}T00:00:00.000Z`),
              new Date(`${date}T23:59:59.999Z`),
            ],
          },
        },
      ];
    }

    // Search query
    if (search && search.trim() !== "") {
      const q = `%${search.trim()}%`;
      const searchConditions = [
        { fileNo: { [Op.like]: q } },
        { recordNo: { [Op.like]: q } },
        { invoiceNo: { [Op.like]: q } },
        { refNo: { [Op.like]: q } },
        { customerName: { [Op.like]: q } },
      ];

      if (whereClause[Op.or]) {
        whereClause[Op.and] = [{ [Op.or]: whereClause[Op.or] }, { [Op.or]: searchConditions }];
        delete whereClause[Op.or];
      } else {
        whereClause[Op.or] = searchConditions;
      }
    }

    const isAll = limit === "all" || limit === "0" || parseInt(limit, 10) >= 1000;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = isAll ? 5000 : parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    const { count, rows } = await Report.findAndCountAll({
      where: whereClause,
      order: [["id", "DESC"]],
      limit: limitNum,
      offset,
    });

    const formattedReports = rows.map((r) => {
      const extraData = parseReportData(r.data);
      return {
        ...extraData,
        _id: r.id,
        id: r.id,
        fileNo: r.fileNo,
        "File No": r.fileNo,
        recordNo: r.recordNo,
        "Record No": r.recordNo,
        refNo: r.refNo,
        "Ref No": r.refNo,
        entryDate: r.entryDate,
        "Entry Dates": r.entryDate,
        invoiceNo: r.invoiceNo,
        "Invoice No": r.invoiceNo,
        customerName: r.customerName,
        agentName: r.agentName,
        total: r.total,
        netAmount: r.netAmount,
        status: r.status,
        level: r.level,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        reports: formattedReports,
        pagination: {
          total: count,
          page: pageNum,
          pages: Math.ceil(count / limitNum) || 1,
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 5. Delete Report
 * DELETE /api/v1/user/reports/:id
 */
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findByPk(id);

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    const userId = report.userId;
    await report.destroy();

    // Decrement valid, increment deleted
    const user = await User.findByPk(userId);
    if (user) {
      user.validRecords = Math.max(0, (user.validRecords || 1) - 1);
      user.deletedRecords = (user.deletedRecords || 0) + 1;
      await user.save();
    }

    broadcastOperatorsUpdate("REPORT_DELETED", { userId, reportId: id });

    return res.status(200).json({
      success: true,
      message: "Report deleted from database successfully.",
    });
  } catch (error) {
    console.error("Error deleting report:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update Report (Admin & Operator)
 * PUT /api/v1/user/reports/:id
 * PUT /api/v1/reports/:id
 */
export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findByPk(id);

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    const currentData = parseReportData(report.data);
    const updatedData = { ...currentData, ...req.body };

    // Update top-level columns if present in request body
    if (req.body.fileNo !== undefined) report.fileNo = req.body.fileNo;
    if (req.body.recordNo !== undefined) report.recordNo = req.body.recordNo;
    if (req.body.refNo !== undefined) report.refNo = req.body.refNo;
    if (req.body.entryDate !== undefined) report.entryDate = req.body.entryDate;
    if (req.body.invoiceNo !== undefined) report.invoiceNo = req.body.invoiceNo;
    if (req.body.accountNo !== undefined) report.accountNo = req.body.accountNo;
    if (req.body.customerName !== undefined) {
      report.customerName = req.body.customerName;
    } else if (req.body.custName !== undefined) {
      report.customerName = req.body.custName;
    }
    if (req.body.agentName !== undefined) report.agentName = req.body.agentName;
    if (req.body.creditCardNo !== undefined) report.creditCardNo = req.body.creditCardNo;
    if (req.body.total !== undefined) report.total = req.body.total;
    if (req.body.netAmount !== undefined) report.netAmount = req.body.netAmount;
    if (req.body.status !== undefined) report.status = req.body.status;
    if (req.body.level !== undefined) report.level = req.body.level;

    report.data = updatedData;
    await report.save();

    // Broadcast update to real-time Admin and Operators
    broadcastOperatorsUpdate("REPORT_UPDATED", {
      userId: report.userId,
      reportId: report.id,
      level: report.level,
      timestamp: new Date().toISOString(),
    });

    const fullResult = {
      ...updatedData,
      id: report.id,
      _id: report.id,
      userId: report.userId,
      level: report.level,
      fileNo: report.fileNo,
      recordNo: report.recordNo,
      refNo: report.refNo,
      entryDate: report.entryDate,
      invoiceNo: report.invoiceNo,
      accountNo: report.accountNo,
      customerName: report.customerName,
      agentName: report.agentName,
      creditCardNo: report.creditCardNo,
      total: report.total,
      netAmount: report.netAmount,
      status: report.status,
    };

    return res.status(200).json({
      success: true,
      message: "Report updated successfully.",
      data: fullResult,
    });
  } catch (error) {
    console.error("Error updating report:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 6. Get Single Report by ID
 * GET /api/v1/reports/detail/:id
 */
export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findByPk(id, {
      include: [{ model: User, as: "user", attributes: ["id", "username", "email"] }],
    });
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }
    const extraData = parseReportData(report.data);
    return res.status(200).json({
      success: true,
      data: {
        ...extraData,
        id: report.id,
        level: report.level,
        fileNo: report.fileNo,
        recordNo: report.recordNo,
        refNo: report.refNo,
        entryDate: report.entryDate,
        invoiceNo: report.invoiceNo,
        customerName: report.customerName,
        agentName: report.agentName,
        creditCardNo: report.creditCardNo,
        total: report.total,
        netAmount: report.netAmount,
        status: report.status,
        operator: report.user,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 7. Get Today's Reports
 * GET /api/v1/user/todays-report/:id
 */
export const getTodaysReport = async (req, res) => {
  try {
    const { id } = req.params;
    const today = new Date().toISOString().split("T")[0];

    const reports = await Report.findAll({
      where: {
        userId: id,
        [Op.or]: [
          { entryDate: today },
          { createdAt: { [Op.gte]: new Date(today) } },
        ],
      },
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: reports.map((r) => ({ ...parseReportData(r.data), ...r.toJSON() })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 8. Update Quality Assurance (QA) Batch Status
 * PUT /api/v1/user/qa-batch-status
 * Body: { userId, level, status, reportIds }
 */
export const updateQABatchStatus = async (req, res) => {
  try {
    const { userId, level, status = "Pending QA", reportIds } = req.body;
    const today = new Date().toISOString().split("T")[0];

    const whereClause = {};
    if (userId) whereClause.userId = userId;
    if (level) whereClause.level = level;
    if (Array.isArray(reportIds) && reportIds.length > 0) {
      whereClause.id = { [Op.in]: reportIds };
    } else {
      whereClause[Op.or] = [
        { entryDate: today },
        { createdAt: { [Op.gte]: new Date(today) } },
      ];
    }

    const [updatedCount] = await Report.update(
      { status },
      { where: whereClause }
    );

    // Broadcast to Admin and Operators
    broadcastOperatorsUpdate("QA_STATUS_UPDATED", {
      userId,
      level,
      status,
      updatedCount,
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: `QA Checkpoint status updated to "${status}".`,
      data: {
        status,
        updatedCount,
        level,
      },
    });
  } catch (error) {
    console.error("Error updating QA batch status:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

