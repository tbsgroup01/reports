import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function OperatorPagination({ shownCount, totalCount }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-slate-100 bg-white rounded-b-2xl">
      <div className="text-xs  sm:text-xs m text-slate-500">
        Showing <span className="font-semibold text-slate-800">1–{shownCount}</span> of{" "}
        <span className="font-semibold text-slate-800">{totalCount}</span> operators
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer disabled:opacity-40"
          disabled
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0e6b38] text-white text-xs  font-bold shadow-xs cursor-pointer"
        >
          1
        </button>

        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer disabled:opacity-40"
          disabled
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
