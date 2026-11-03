import React, { useState } from "react";

export default function DownloadReport({ level = "medical", records = [] }) {
  const [fromDate, setFromDate] = useState("2026-11-01");
  const [toDate, setToDate] = useState("2026-11-03");
  const [format, setFormat] = useState("csv");
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      // Build dynamic CSV
      if (records.length === 0) {
        alert("No records to export.");
        setIsExporting(false);
        return;
      }

      const headers = Object.keys(records[0]).join(",");
      const rows = records.map((r) =>
        Object.values(r)
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      );
      const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `${level.toUpperCase()}_Report_${fromDate}_to_${toDate}.${format === "excel" ? "xls" : "csv"}`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
      {/* Title */}
      <div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 capitalize">
          Download {level} Export Reports
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Generate structured exports of completed {level} digitization records for auditing and payroll.
        </p>
      </div>

      {/* Date & Format Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            From Date
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#118848]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            To Date
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#118848]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Export Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#118848]"
          >
            <option value="csv">Standard CSV (.csv)</option>
            <option value="excel">Microsoft Excel (.xls)</option>
          </select>
        </div>
      </div>

      {/* Summary Box */}
      <div className="flex items-center justify-between p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#118848] flex items-center justify-center font-bold">
            📄
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">
              {records.length} Completed {level.toUpperCase()} Records Ready
            </div>
            <div className="text-xs text-slate-600">
              Filtered for shift: {fromDate} to {toDate}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={isExporting}
          className="inline-flex items-center gap-2 bg-[#0e6b38] hover:bg-[#0b542c] active:scale-[0.98] text-white font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs transition-all cursor-pointer disabled:opacity-60"
        >
          {isExporting ? (
            <span>Generating file...</span>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download Report</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

