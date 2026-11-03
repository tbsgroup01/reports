import React from "react";
import { Database } from "lucide-react";

export default function TodaysReport({ level = "medical", records = [] }) {
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 capitalize">
            Today's Backup Summary ({todayStr})
          </h3>
          <p className="text-xs text-slate-500">
            Real-time snapshot of {level} records keyed during the current operating shift.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert(`Shift backup created for ${todayStr}`)}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
        >
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Create Snapshot Backup</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#f0fdf4] border border-[#dcfce7] p-4 rounded-xl">
          <div className="text-xs font-semibold text-slate-600">Today's Keyed Records</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{records.length}</div>
        </div>

        <div className="bg-[#eff6ff] border border-[#dbeafe] p-4 rounded-xl">
          <div className="text-xs font-semibold text-slate-600">Verification Status</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">Pending QA</div>
        </div>

        <div className="bg-[#faf5ff] border border-[#f3e8ff] p-4 rounded-xl">
          <div className="text-xs font-semibold text-slate-600">Operator AHT (Avg Speed)</div>
          <div className="text-2xl font-bold text-purple-700 mt-1">1m 42s</div>
        </div>
      </div>
    </div>
  );
}
