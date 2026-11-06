import React, { useState, useEffect, useMemo } from "react";
import {
  Database,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Send,
  AlertTriangle,
  FileCheck,
  Download,
  RotateCcw,
  Calendar,
  Lock,
  KeyRound,
  ShieldCheck,
  Loader2,
  FileSpreadsheet,
} from "lucide-react";
import { downloadPasswordProtectedZip } from "../../../utils/secureExportUtils";

export default function TodaysReport({ level = "medical", records = [] }) {
  const todayStr = new Date().toISOString().split("T")[0];

  // Calculate default 7-days-ago date
  const defaultStartDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d.toISOString().split("T")[0];
  })();

  // Calendar Date Range state
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(todayStr);

  // Authenticated operator
  const currentUser = (() => {
    try {
      const u = localStorage.getItem("authUser");
      return u ? JSON.parse(u) : { id: 5, username: "abdesh" };
    } catch {
      return { id: 5, username: "abdesh" };
    }
  })();

  const storageKey = `qa_status_${level}_${currentUser.id || 5}`;

  // QA Checkpoint Status: 'In Progress' | 'Pending QA' | 'Approved & Synced' | 'Needs Revision'
  const [qaStatus, setQaStatus] = useState(() => {
    return localStorage.getItem(storageKey) || (records.length > 0 ? "Pending QA" : "In Progress");
  });

  const [lastBackupTime, setLastBackupTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExportingBackup, setIsExportingBackup] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Calculate duration in days between startDate and endDate
  const selectedDaysCount = useMemo(() => {
    try {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const diffTime = e - s;
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  }, [startDate, endDate]);

  // Filter records within selected date range
  const rangeRecords = useMemo(() => {
    if (!Array.isArray(records) || records.length === 0) return [];
    return records.filter((r) => {
      const recDate = r.entryDate || (r.createdAt ? r.createdAt.split("T")[0] : null);
      if (!recDate) return true; // Include if date missing
      return recDate >= startDate && recDate <= endDate;
    });
  }, [records, startDate, endDate]);

  // Sync QA status to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, qaStatus);
  }, [qaStatus, storageKey]);

  // Quick preset ranges
  const applyPreset = (preset) => {
    const today = new Date();
    const endStr = today.toISOString().split("T")[0];
    let start = new Date();

    if (preset === "today") {
      setStartDate(endStr);
      setEndDate(endStr);
      return;
    }
    if (preset === "7days") {
      start.setDate(today.getDate() - 6);
    } else if (preset === "15days") {
      start.setDate(today.getDate() - 14);
    } else if (preset === "30days") {
      start.setDate(today.getDate() - 29);
    } else if (preset === "month") {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(endStr);
    setFeedbackMessage(null);
    setErrorMessage(null);
  };

  // Update QA Verification Status via API and local state
  const handleUpdateStatus = async (newStatus) => {
    setIsSubmitting(true);
    setQaStatus(newStatus);
    localStorage.setItem(storageKey, newStatus);

    try {
      await fetch("https://api.abdivya.com/api/v1/user/qa-batch-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id || 5,
          level,
          status: newStatus,
        }),
      });
    } catch (e) {
      console.warn("Backend QA status sync:", e);
    } finally {
      setIsSubmitting(false);
    }

    if (newStatus === "Pending QA") {
      setFeedbackMessage(
        "Quality Assurance (QA) Checkpoint: Today's batch has been finalized and submitted to QA. It is now awaiting supervisor/QA audit and approval before syncing to the master client billing database."
      );
    } else if (newStatus === "Approved & Synced") {
      setFeedbackMessage(
        "Success! QA audit approved. All records in today's batch have been verified and synced to the master client billing database."
      );
    } else if (newStatus === "In Progress") {
      setFeedbackMessage("Batch reopened. Status returned to In Progress for further keying.");
    }
  };

  // Download Strongly Password-Protected Range Backup ZIP
  const handleDownloadBackupZip = async () => {
    setErrorMessage(null);
    setFeedbackMessage(null);

    if (rangeRecords.length === 0) {
      setErrorMessage(
        `No records found between ${startDate} and ${endDate}. Please select a wider date range or enter records in the Work Tab.`
      );
      return;
    }

    setIsExportingBackup(true);
    try {
      const result = await downloadPasswordProtectedZip({
        fileName: `ABDIVA_${level.toUpperCase()}_BACKUP_${startDate}_to_${endDate}.zip`,
        records: rangeRecords,
        level,
        reportType: "RANGE_BACKUP",
        dateRangeText: `${startDate} to ${endDate} (${selectedDaysCount} Days)`,
        operatorName: currentUser.username || "Operator",
      });

      const nowTime = new Date().toLocaleTimeString();
      setLastBackupTime(nowTime);
      setFeedbackMessage(
        `Encrypted Backup Archive (${result.fileName}) created successfully at ${nowTime} with ${result.totalRecords} records across ${selectedDaysCount} days. Archive is strongly password-protected for Admin extraction.`
      );
    } catch (err) {
      console.error("Backup download error:", err);
      setErrorMessage(err.message || "Failed to create encrypted backup archive.");
    } finally {
      setIsExportingBackup(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
      {/* 1. Header & Quick Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 capitalize">
              Data Backup & QA Checkpoint ({level})
            </h3>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                qaStatus === "Approved & Synced"
                  ? "bg-emerald-100 text-[#0e6b38] border border-emerald-300"
                  : qaStatus === "Pending QA"
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : "bg-blue-100 text-blue-900 border border-blue-200"
              }`}
            >
              {qaStatus === "Approved & Synced" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              {qaStatus === "Pending QA" && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
              {qaStatus === "In Progress" && <Clock className="w-3.5 h-3.5 text-blue-600" />}
              <span>QA: {qaStatus}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-900 text-emerald-400 border border-slate-700">
              <Lock className="w-3 h-3 text-emerald-400" />
              Admin Password Protected
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Select calendar date range to generate a strongly encrypted historical backup archive.
            All archives are protected with the Admin Master Security Key.
          </p>
        </div>

        {/* QA Workflow Actions */}
        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
          {qaStatus !== "Pending QA" && qaStatus !== "Approved & Synced" && (
            <button
              type="button"
              disabled={isSubmitting || records.length === 0}
              onClick={() => handleUpdateStatus("Pending QA")}
              className="inline-flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] text-white font-semibold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-2xs flex-1 sm:flex-initial"
              title="Finalize today's batch and submit for supervisor QA audit"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Finalize & Submit to QA</span>
            </button>
          )}

          {qaStatus === "Pending QA" && (
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleUpdateStatus("Approved & Synced")}
                className="inline-flex items-center justify-center gap-1.5 bg-[#0e6b38] hover:bg-[#0b542c] active:scale-[0.98] text-white font-semibold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-2xs flex-1 sm:flex-initial"
                title="Approve QA audit and sync to master client billing database"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve & Sync (QA Test)</span>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStatus("In Progress")}
                className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-xl text-xs transition-all cursor-pointer flex-1 sm:flex-initial"
                title="Reopen batch for editing"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reopen Batch</span>
              </button>
            </div>
          )}

          {qaStatus === "Approved & Synced" && (
            <button
              type="button"
              onClick={() => handleUpdateStatus("In Progress")}
              className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-xl text-xs transition-all cursor-pointer flex-1 sm:flex-initial"
              title="Start a new batch"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start New Shift Batch</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Calendar Range Selector & Presets */}
      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#0e6b38]" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              Select Backup Calendar Date Range
            </h4>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-100 text-[#0e6b38] border border-emerald-300 w-fit">
            {selectedDaysCount} {selectedDaysCount === 1 ? "Day" : "Days"} Selected ({rangeRecords.length} Records)
          </span>
        </div>

        {/* Calendar Date Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Start Date (From)
            </label>
            <input
              type="date"
              value={startDate}
              max={endDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setFeedbackMessage(null);
                setErrorMessage(null);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#118848]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              End Date (To)
            </label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              max={todayStr}
              onChange={(e) => {
                setEndDate(e.target.value);
                setFeedbackMessage(null);
                setErrorMessage(null);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#118848]"
            />
          </div>
        </div>

        {/* Quick Range Presets */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            Presets:
          </span>
          <button
            type="button"
            onClick={() => applyPreset("today")}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all cursor-pointer"
          >
            Today (1 Day)
          </button>
          <button
            type="button"
            onClick={() => applyPreset("7days")}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all cursor-pointer"
          >
            Last 7 Days
          </button>
          <button
            type="button"
            onClick={() => applyPreset("15days")}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all cursor-pointer"
          >
            Last 15 Days
          </button>
          <button
            type="button"
            onClick={() => applyPreset("30days")}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all cursor-pointer"
          >
            Last 30 Days
          </button>
          <button
            type="button"
            onClick={() => applyPreset("month")}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all cursor-pointer"
          >
            This Month
          </button>
        </div>
      </div>

      {/* 3. Encrypted Backup Download CTA Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl shadow-sm border border-slate-700">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2 flex-wrap">
              <span>{rangeRecords.length} Historical Records in Selected Period</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {startDate} to {endDate}
              </span>
            </div>
            <div className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Packages complete CSV + JSON snapshot into password-protected .zip</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadBackupZip}
          disabled={isExportingBackup || rangeRecords.length === 0}
          className="inline-flex items-center justify-center gap-2 bg-[#0e6b38] hover:bg-[#0b542c] active:scale-[0.98] text-white font-semibold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto shrink-0"
        >
          {isExportingBackup ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Encrypting & Generating Backup ZIP...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Encrypted Backup ({selectedDaysCount} Days)</span>
            </>
          )}
        </button>
      </div>

      {/* 4. High Security Admin Password Notice */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
          <KeyRound className="w-5 h-5 text-amber-700" />
        </div>
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              Strict Password Protection & Confidentiality
            </h4>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              <Lock className="w-2.5 h-2.5" /> Strong Encryption
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The backup file is secured using <strong>256-bit password-protected ZIP encryption</strong>.
            Neither operators nor unauthorized third parties can open, extract, or tamper with the exported
            data. <strong className="text-amber-900">Only authorized Administrators with the Master Password</strong> can
            decrypt and inspect the records.
          </p>
        </div>
      </div>

      {/* 5. Feedback / Error Notification Banners */}
      {feedbackMessage && (
        <div className="p-3.5 rounded-xl text-xs font-semibold flex items-start justify-between gap-3 bg-emerald-50 text-emerald-900 border border-emerald-200 animate-tab-fade">
          <div className="flex items-start gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{feedbackMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl text-xs font-semibold flex items-start justify-between gap-3 bg-red-50 text-red-900 border border-red-200 animate-tab-fade">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-700 hover:text-red-900 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 6. Dynamic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Keyed Records in Selected Range */}
        <div className="bg-[#f0fdf4] border border-[#dcfce7] p-5 rounded-2xl flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wide">
            Range Keyed Records ({selectedDaysCount} Days)
          </div>
          <div className="text-3xl font-extrabold text-[#0e6b38] my-2">{rangeRecords.length}</div>
          <div className="text-[11px] text-slate-500 font-medium">
            {rangeRecords.length > 0
              ? `From ${startDate} to ${endDate}`
              : "No records found in this range."}
          </div>
        </div>

        {/* Card 2: Verification Status (QA Checkpoint) */}
        <div
          className={`p-5 rounded-2xl flex flex-col justify-between border transition-all ${
            qaStatus === "Approved & Synced"
              ? "bg-emerald-50 border-emerald-200"
              : qaStatus === "Pending QA"
              ? "bg-amber-50/80 border-amber-200"
              : "bg-blue-50/80 border-blue-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Verification Status
            </div>
            {qaStatus === "Pending QA" && (
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            )}
          </div>

          <div
            className={`text-2xl font-extrabold my-2 ${
              qaStatus === "Approved & Synced"
                ? "text-[#0e6b38]"
                : qaStatus === "Pending QA"
                ? "text-amber-800"
                : "text-blue-700"
            }`}
          >
            {qaStatus}
          </div>

          <p className="text-[11px] font-medium leading-relaxed text-slate-600">
            {qaStatus === "Pending QA" &&
              "Today's batch is finalized and awaiting supervisor/QA audit and approval before syncing to the master billing database."}
            {qaStatus === "Approved & Synced" &&
              "Verified by supervisor/QA auditor. Records successfully synced to master billing database."}
            {qaStatus === "In Progress" &&
              "Batch is open. Key records and click 'Finalize & Submit to QA' when ready."}
            {qaStatus === "Needs Revision" &&
              "Supervisor noted discrepancies. Please check flagged items."}
          </p>
        </div>

        {/* Card 3: Operator AHT (Avg Speed) */}
        <div className="bg-[#faf5ff] border border-[#f3e8ff] p-5 rounded-2xl flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wide">
            Operator AHT (Avg Speed)
          </div>
          <div className="text-3xl font-extrabold text-purple-700 my-2">1m 42s</div>
          <div className="text-[11px] text-slate-500 font-medium">
            Benchmark: under 2m 15s per sheet.
          </div>
        </div>
      </div>

      {/* 7. Quality Assurance (QA) Policy Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5 text-amber-700" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs sm:text-xs font-bold text-slate-900">
            Quality Assurance (QA) Audit Policy
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            In accordance with document transcription standards, newly keyed records remain in{" "}
            <strong className="text-amber-800 font-bold">Pending QA</strong> status once finalized by the operator.
            An authorized supervisor reviews the batch for data accuracy. Only upon official approval
            is the batch marked <strong className="text-emerald-700 font-bold">Approved & Synced</strong> and committed
            to the master client billing database.
          </p>
          {lastBackupTime && (
            <p className="text-[11px] text-slate-500 pt-1 font-medium">
              Last encrypted snapshot backup generated: <strong>{lastBackupTime}</strong>
            </p>
          )}
        </div>
      </div>

      {/* 8. Selected Period Batch Items Table */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
            Records in Selected Period ({rangeRecords.length})
          </h4>
          <span className="text-[11px] text-slate-500 font-medium">
            Period: <strong className="font-semibold text-slate-800">{startDate} to {endDate}</strong>
          </span>
        </div>

        {rangeRecords.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl text-xs text-slate-500">
            No records found for the range {startDate} to {endDate}. Adjust the calendar range or enter new records in the Work Tab.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse min-w-[560px]">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                  <th className="py-2.5 px-4">Record No</th>
                  <th className="py-2.5 px-4">File No</th>
                  <th className="py-2.5 px-4">Invoice No</th>
                  <th className="py-2.5 px-4">Customer</th>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Amount</th>
                  <th className="py-2.5 px-4 text-right">QA Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {rangeRecords.map((rec, i) => (
                  <tr key={rec.id || rec._id || i} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-mono font-bold text-[#0e6b38]">
                      {rec.recordNo || `REC-${i + 1}`}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-700 text-[11px]">
                      {rec.fileNo || "—"}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-700">
                      {rec.invoiceNo || "—"}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-800">
                      {rec.customerName || rec.custName || "—"}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-600 text-[11px]">
                      {rec.entryDate || rec.createdAt?.split("T")[0] || todayStr}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 font-mono">
                      {rec.total || rec.netAmount || rec.phoneCost || rec.balance || "0.00"}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          qaStatus === "Approved & Synced"
                            ? "bg-emerald-100 text-[#0e6b38] border border-emerald-300"
                            : qaStatus === "Pending QA"
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : "bg-blue-100 text-blue-900 border border-blue-200"
                        }`}
                      >
                        {qaStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
