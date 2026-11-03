import React from "react";

export default function OperatorMetrics({ total, active, frozen, jumbled }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* Total Operators */}
      <div className="bg-gradient-to-br from-white to-[#edf7f2] border border-[#d2edd9] rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[#e3f4e8] text-[#118848] flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <div>
          <div className="text-xs sm:text-sm font-medium text-slate-500">Total Operators</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">{total}</div>
        </div>
      </div>

      {/* Active */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[#eaf4ff] text-[#2563eb] flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <div className="text-xs sm:text-sm font-medium text-slate-500">Active</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">{active}</div>
        </div>
      </div>

      {/* Frozen */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[#fff2e2] text-[#d97706] flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2v20m10-10H2m17.07-7.07l-14.14 14.14M19.07 19.07L4.93 4.93"
            />
          </svg>
        </div>
        <div>
          <div className="text-xs sm:text-sm font-medium text-slate-500">Frozen</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">{frozen}</div>
        </div>
      </div>

      {/* Jumbled */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[#f4ebff] text-[#7e22ce] flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"
            />
          </svg>
        </div>
        <div>
          <div className="text-xs sm:text-sm font-medium text-slate-500">Jumbled</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">{jumbled}</div>
        </div>
      </div>
    </div>
  );
}

