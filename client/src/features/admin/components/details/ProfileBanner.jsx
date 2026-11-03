import React from "react";
import StatusBadge from "../../../../components/StatusBadge";
import { User, Mail, Calendar, FileText, CheckCircle2, XCircle } from "lucide-react";

export default function ProfileBanner({ operator }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 shadow-xs">
      {/* Operator Profile Info */}
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-[#e3f4e8] text-[#118848] flex items-center justify-center shrink-0 shadow-inner">
          <User className="w-10 h-10 stroke-[1.6]" />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-bold text-slate-900">{operator.username}</h2>
            {operator.badges?.map((badge) => (
              <StatusBadge key={badge} status={badge} type="badge" />
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <Mail className="w-4 h-4 text-slate-400" />
            <span>{operator.email || `${operator.username}@gmail.com`}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Created on {operator.createdAt || "03 Nov 2026, 11:20 AM"}</span>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 lg:w-[55%]">
        {/* Total Reports */}
        <div className="bg-[#faf5ff] border border-[#f3e8ff] rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#ede2ff] text-[#7e22ce] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-600">Total Reports</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{operator.totalReports ?? 0}</div>
          </div>
        </div>

        {/* Valid Records */}
        <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#daf7e3] text-[#118848] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-600">Valid Records</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{operator.validRecords ?? 0}</div>
          </div>
        </div>

        {/* Deleted Records */}
        <div className="bg-[#fef2f2] border border-[#fee2e2] rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#fdd8d8] text-[#dc2626] flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-600">Deleted Records</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{operator.deletedRecords ?? 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
