import React from "react";
import StatusBadge from "../../../../components/StatusBadge";

export default function ProfileBanner({ operator }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 shadow-xs">
      {/* Operator Profile Info */}
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-[#e3f4e8] text-[#118848] flex items-center justify-center shrink-0 shadow-inner">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-bold text-slate-900">{operator.username}</h2>
            {operator.badges?.map((badge) => (
              <StatusBadge key={badge} status={badge} type="badge" />
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{operator.email || `${operator.username}@gmail.com`}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Created on {operator.createdAt || "03 Nov 2026, 11:20 AM"}</span>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 lg:w-[55%]">
        {/* Total Reports */}
        <div className="bg-[#faf5ff] border border-[#f3e8ff] rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#ede2ff] text-[#7e22ce] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-600">Total Reports</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{operator.totalReports ?? 0}</div>
          </div>
        </div>

        {/* Valid Records */}
        <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#daf7e3] text-[#118848] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-600">Valid Records</div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{operator.validRecords ?? 0}</div>
          </div>
        </div>

        {/* Deleted Records */}
        <div className="bg-[#fef2f2] border border-[#fee2e2] rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#fdd8d8] text-[#e11d48] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
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

