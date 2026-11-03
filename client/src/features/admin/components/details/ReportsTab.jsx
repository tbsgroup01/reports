import React, { useState } from "react";

export default function ReportsTab() {
  const [reportSearch, setReportSearch] = useState("");

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Search Bar */}
      <div className="flex justify-end">
        <div className="relative w-full max-w-sm">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by file no, record no or invoice no..."
            value={reportSearch}
            onChange={(e) => setReportSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm placeholder-slate-400 text-slate-800 focus:outline-none focus:border-[#118848] focus:ring-2 focus:ring-[#118848]/15 transition-all"
          />
        </div>
      </div>

      {/* Empty State Display */}
      <div className="py-12 sm:py-16 flex flex-col items-center justify-center text-center">
        <div className="relative w-28 h-28 mb-5 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#e7f7ed] rounded-full blur-xl opacity-70"></div>
          <div className="relative bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm flex items-center justify-center">
            <svg className="w-14 h-14 text-emerald-400" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="14" y="8" width="36" height="48" rx="6" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="2.5" />
              <line x1="22" y1="20" x2="42" y2="20" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="22" y1="28" x2="36" y2="28" stroke="#86EFAC" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="22" y1="36" x2="32" y2="36" stroke="#86EFAC" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="42" cy="42" r="10" fill="white" stroke="#64748B" strokeWidth="2.5" />
              <line x1="49" y1="49" x2="56" y2="56" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <h4 className="text-lg font-bold text-slate-900 mb-1">No reports found</h4>
        <p className="text-sm text-slate-500 max-w-sm">
          This operator has not submitted any reports yet.
        </p>
      </div>
    </div>
  );
}

