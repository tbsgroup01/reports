import React from "react";

export default function OperatorPagination({ shownCount, totalCount }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-slate-100 bg-white rounded-b-2xl">
      <div className="text-xs sm:text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-800">1–{shownCount}</span> of{" "}
        <span className="font-semibold text-slate-800">{totalCount}</span> operators
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer disabled:opacity-40"
          disabled
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0e6b38] text-white text-xs font-bold shadow-xs cursor-pointer"
        >
          1
        </button>

        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer disabled:opacity-40"
          disabled
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

