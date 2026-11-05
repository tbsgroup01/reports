import React from "react";
import StatusBadge from "../../../../components/StatusBadge";
import { Mail, Calendar, FileText, CheckCircle2, XCircle } from "lucide-react";

export default function ProfileBanner({ operator }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-xs w-full h-full">
      {/* Top: Operator Profile Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{operator.username}</h2>
          {Array.isArray(operator.badges) &&
            operator.badges.map((badge) => (
              <StatusBadge key={badge} status={badge} type="badge" />
            ))}
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-xs text-slate-500 font-medium">
          <Mail className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate">{operator.email || `${operator.username}@gmail.com`}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Created on {operator.createdAt || "03 Nov 2026, 11:20 AM"}</span>
        </div>
      </div>

      {/* Bottom: 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 w-full">
        {/* Total Reports */}
        <div className="bg-[#faf5ff] border border-[#f3e8ff] rounded-2xl p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#ede2ff] text-[#7e22ce] flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-semibold text-slate-600 truncate">Total Reports</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{operator.totalReports ?? 0}</div>
          </div>
        </div>

        {/* Valid Records */}
        <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-2xl p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#daf7e3] text-[#118848] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-semibold text-slate-600 truncate">Valid Records</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{operator.validRecords ?? 0}</div>
          </div>
        </div>

        {/* Deleted Records */}
        <div className="bg-[#fef2f2] border border-[#fee2e2] rounded-2xl p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#fdd8d8] text-[#dc2626] flex items-center justify-center shrink-0">
            <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-semibold text-slate-600 truncate">Deleted Records</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{operator.deletedRecords ?? 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
