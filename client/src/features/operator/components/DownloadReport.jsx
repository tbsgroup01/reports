import React, { useState, useMemo } from "react";
import {
  Download,
  FileSpreadsheet,
  Loader2,
  Lock,
  ShieldCheck,
  Calendar,
  AlertCircle,
  CheckCircle2,
  FileText,
  KeyRound,
} from "lucide-react";
import { downloadPasswordProtectedZip } from "../../../utils/secureExportUtils";

export default function DownloadReport({ level = "medical", records = [] }) {
  const todayStr = new Date().toISOString().split("T")[0];
  const yesterdayStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  })();

  const [reportDate, setReportDate] = useState(todayStr);
  const [isExporting, setIsExporting] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  // Authenticated operator name
  const currentUser = (() => {
    try {
      const u = localStorage.getItem("authUser");
      return u ? JSON.parse(u) : { username: "Operator" };
    } catch {
      return { username: "Operator" };
    }
  })();

  // Filter records strictly for the selected daily shift date
  const filteredRecords = useMemo(() => {
    if (!Array.isArray(records) || records.length === 0) return [];
    return records.filter((r) => {
      const d = r.entryDate || (r.createdAt ? r.createdAt.split("T")[0] : null);
      // If record date matches selected date, or if it's today and record has no date
      if (d === reportDate) return true;
      if (!d && reportDate === todayStr) return true;
      return false;
    });
  }, [records, reportDate, todayStr]);

  // Calculate daily totals
  const totalAmount = useMemo(() => {
    return filteredRecords.reduce((sum, r) => {
      const val = parseFloat(r.total || r.netAmount || r.phoneCost || r.balance || 0);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  }, [filteredRecords]);

  // Handle encrypted password-protected download
  const handleDownload = async () => {
    setErrorInfo(null);
    setSuccessInfo(null);

    if (filteredRecords.length === 0) {
      setErrorInfo(
        `No completed records found for ${reportDate}. Please select a date with saved shift entries or enter records in the Work Tab.`
      );
      return;
    }

    setIsExporting(true);
    try {
      const result = await downloadPasswordProtectedZip({
        fileName: `ABDIVA_DAILY_${level.toUpperCase()}_REPORT_${reportDate}.zip`,
        records: filteredRecords,
        level,
        reportType: "DAILY_REPORT",
        dateRangeText: `Daily Shift: ${reportDate}`,
        operatorName: currentUser.username || "Operator",
      });

      setSuccessInfo({
        fileName: result.fileName,
        count: result.totalRecords,
        date: reportDate,
      });
    } catch (err) {
      console.error("Export error:", err);
      setErrorInfo(err.message || "Failed to generate password-protected export archive.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 capitalize">
              Daily Shift Report Download ({level})
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-[#0e6b38] border border-emerald-300">
              <Lock className="w-3 h-3 text-[#0e6b38]" />
              Password Protected (Admin Only)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Download daily shift export. This download is strictly restricted to a single day's
            shift records and is encrypted with the Admin Master Security Key.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setReportDate(todayStr)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              reportDate === todayStr
                ? "bg-[#0e6b38] text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            Today ({todayStr})
          </button>
          <button
            type="button"
            onClick={() => setReportDate(yesterdayStr)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              reportDate === yesterdayStr
                ? "bg-[#0e6b38] text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            Yesterday
          </button>
        </div>
      </div>

      {/* Date Selector & Shift Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Selection Box */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Select Shift Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={reportDate}
              onChange={(e) => {
                setReportDate(e.target.value);
                setSuccessInfo(null);
                setErrorInfo(null);
              }}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#118848]"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Daily reports contain entries recorded on this exact date.
          </p>
        </div>

        {/* Shift Records Stat */}
        <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Records For {reportDate}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0e6b38] my-1">
            {filteredRecords.length}
          </div>
          <span className="text-[11px] text-slate-600 font-medium">
            {filteredRecords.length > 0
              ? `Ready to package into encrypted daily ZIP`
              : "0 entries found for this date"}
          </span>
        </div>

        {/* Total Value / Shift Metric */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Shift Total Value
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 my-1 font-mono">
            {totalAmount.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Aggregated gross billing for {reportDate}
          </span>
        </div>
      </div>

      {/* High Security Password Banner */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
          <KeyRound className="w-5 h-5 text-amber-700" />
        </div>
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              Strong Encryption & Admin Access Protection
            </h4>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              <Lock className="w-2.5 h-2.5" /> High Security
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The generated download file is packaged as a <strong>password-encrypted ZIP archive</strong>.
            Operators cannot view or modify the export files.{" "}
            <strong className="text-amber-900">Only authorized Administrators with the Master Password</strong> can
            unlock and extract the contents (CSV sheet, JSON audit log, and verification certificate).
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {successInfo && (
        <div className="p-4 rounded-xl text-xs font-semibold flex items-start justify-between gap-3 bg-emerald-50 text-emerald-900 border border-emerald-200">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-950">
                Encrypted Daily Report Downloaded Successfully!
              </div>
              <div className="text-emerald-800 mt-0.5">
                Saved as <code className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded">{successInfo.fileName}</code>{" "}
                ({successInfo.count} records for {successInfo.date}). Archive is password-protected for Admin extraction.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSuccessInfo(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Error Notification */}
      {errorInfo && (
        <div className="p-4 rounded-xl text-xs font-semibold flex items-start justify-between gap-3 bg-red-50 text-red-900 border border-red-200">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-red-950">Cannot Export Daily Report</div>
              <div className="text-red-800 mt-0.5">{errorInfo}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setErrorInfo(null)}
            className="text-red-700 hover:text-red-900 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Action Download Box */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 sm:p-5 bg-slate-900 text-white rounded-2xl shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>{filteredRecords.length} Daily Records Ready for Download</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Shift: {reportDate}
              </span>
            </div>
            <div className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Includes CSV spreadsheet + JSON snapshot + Security Notice</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={isExporting || filteredRecords.length === 0}
          className="inline-flex items-center justify-center gap-2 bg-[#0e6b38] hover:bg-[#0b542c] active:scale-[0.98] text-white font-semibold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto shrink-0"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Encrypting & Packaging ZIP...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Encrypted Daily Report (.zip)</span>
            </>
          )}
        </button>
      </div>

      {/* Preview Table of Daily Records */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
            Records Included in Daily Download ({filteredRecords.length})
          </h4>
          <span className="text-[11px] text-slate-500 font-medium">
            Daily Shift: <strong className="text-slate-800">{reportDate}</strong>
          </span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl text-xs text-slate-500">
            No records found for {reportDate}. Switch to{" "}
            <button
              type="button"
              onClick={() => setReportDate(todayStr)}
              className="text-[#0e6b38] font-bold underline cursor-pointer"
            >
              Today
            </button>{" "}
            or add records in the Work Tab.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse min-w-[560px]">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                  <th className="py-2.5 px-4">Record No</th>
                  <th className="py-2.5 px-4">File No</th>
                  <th className="py-2.5 px-4">Invoice No</th>
                  <th className="py-2.5 px-4">Customer Name</th>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredRecords.map((rec, i) => (
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
                    <td className="py-2.5 px-4 text-slate-600 font-mono text-[11px]">
                      {rec.entryDate || rec.createdAt?.split("T")[0] || reportDate}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-900 font-mono">
                      {rec.total || rec.netAmount || rec.phoneCost || rec.balance || "0.00"}
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
