import React, { useState } from "react";
import { Search, FileSearch } from "lucide-react";

export default function ReportsTab() {
  const [reportSearch, setReportSearch] = useState("");

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Search Bar */}
      <div className="flex justify-end">
        <div className="relative w-full max-w-sm">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
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
        <div className="w-16 h-16 mb-4 rounded-2xl bg-[#e3f4e8] text-[#118848] flex items-center justify-center shadow-xs">
          <FileSearch className="w-8 h-8" />
        </div>

        <h4 className="text-lg font-bold text-slate-900 mb-1">No reports found</h4>
        <p className="text-sm text-slate-500 max-w-sm">
          This operator has not submitted any reports yet.
        </p>
      </div>
    </div>
  );
}
