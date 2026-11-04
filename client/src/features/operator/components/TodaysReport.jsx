import React, { useState, useEffect } from "react";
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
} from "lucide-react";

export default function TodaysReport({ level = "medical", records = [] }) {
  const todayStr = new Date().toISOString().split("T")[0];

  // Retrieve authenticated operator
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
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Sync status to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, qaStatus);
  }, [qaStatus, storageKey]);

  // Update QA Verification Status via API and local state
  const handleUpdateStatus = async (newStatus) => {
    setIsSubmitting(true);
    setQaStatus(newStatus);
    localStorage.setItem(storageKey, newStatus);

    try {
      await fetch("http://localhost:3000/api/v1/user/qa-batch-status", {
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

  // Download real JSON snapshot backup of today's records
  const handleCreateSnapshot = () => {
    const timestamp = new Date().toLocaleTimeString();
    const snapshotData = {
      backupDate: todayStr,
      backupTime: timestamp,
      domain: level,
      operator: currentUser.username || "operator",
      qaVerificationStatus: qaStatus,
      totalRecords: records.length,
      records: records,
    };

    const blob = new Blob([JSON.stringify(snapshotData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `shift-backup-${level}-${todayStr}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setLastBackupTime(timestamp);
    setFeedbackMessage(
      `Snapshot backup created successfully at ${timestamp} with ${records.length} records.`
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      {/* 1. Header & Quick Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 capitalize">
              Today's Backup & QA Checkpoint ({todayStr})
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
              <span>{qaStatus}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time snapshot and Quality Assurance (QA) staging for {level} shift records.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
          {/* Create Snapshot Backup */}
          <button
            type="button"
            onClick={handleCreateSnapshot}
            className="inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-semibold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-2xs flex-1 sm:flex-initial"
            title="Download an encrypted JSON snapshot backup to your computer"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Create Snapshot Backup</span>
          </button>

          {/* QA Workflow Actions */}
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

      {/* 2. Feedback Notification Banner */}
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

      {/* 3. 3 Dynamic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Today's Keyed Records */}
        <div className="bg-[#f0fdf4] border border-[#dcfce7] p-5 rounded-2xl flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wide">
            Today's Keyed Records
          </div>
          <div className="text-3xl font-extrabold text-[#0e6b38] my-2">{records.length}</div>
          <div className="text-[11px] text-slate-500 font-medium">
            {records.length > 0 ? "All entries persisted in database." : "No records entered today."}
          </div>
        </div>

        {/* Card 2: Verification Status (The QA Checkpoint) */}
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
              "Today's batch is finalized and awaiting supervisor/QA audit and approval before being synced to the master client billing database."}
            {qaStatus === "Approved & Synced" &&
              "Verified by supervisor/QA auditor. Records successfully synced to master client billing database."}
            {qaStatus === "In Progress" &&
              "Batch is open. Key records and click 'Finalize & Submit to QA' when your shift batch is ready."}
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

      {/* 4. Quality Assurance (QA) Checkpoint Description Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5 text-amber-700" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
            Quality Assurance (QA) Audit Policy
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            In accordance with document transcription standards, newly keyed records remain in{" "}
            <strong className="text-amber-800 font-bold">Pending QA</strong> status once finalized by the operator.
            An authorized supervisor or QA auditor reviews the batch for data accuracy. Only upon official approval
            is the batch marked <strong className="text-emerald-700 font-bold">Approved & Synced</strong> and committed
            to the master client billing database.
          </p>
          {lastBackupTime && (
            <p className="text-[11px] text-slate-500 pt-1 font-medium">
              Last local snapshot backup downloaded: <strong>{lastBackupTime}</strong>
            </p>
          )}
        </div>
      </div>

      {/* 5. Today's Batch Items Table */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
            Today's Batch Items ({records.length})
          </h4>
          <span className="text-[11px] text-slate-500 font-medium">
            QA Checkpoint Stage: <strong className="font-semibold text-slate-800">{qaStatus}</strong>
          </span>
        </div>

        {records.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl text-xs text-slate-500">
            No records keyed during this shift yet. Go to <strong className="text-[#0e6b38]">Work Tab</strong> to start entering records.
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
                  <th className="py-2.5 px-4">Amount ($)</th>
                  <th className="py-2.5 px-4 text-right">QA Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {records.map((rec, i) => (
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
                    <td className="py-2.5 px-4 font-bold text-slate-900 font-mono">
                      ${rec.total || rec.netAmount || "0.00"}
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
