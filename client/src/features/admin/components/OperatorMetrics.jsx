import React from "react";
import { Users, CheckCircle2, Snowflake, Shuffle } from "lucide-react";

export default function OperatorMetrics({ total, active, frozen, jumbled }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* Total Operators */}
      <div className="bg-gradient-to-br from-white to-[#edf7f2] border border-[#d2edd9] rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[#e3f4e8] text-[#118848] flex items-center justify-center shrink-0">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs  sm:text-xs m font-medium text-slate-500">Total Operators</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">{total}</div>
        </div>
      </div>

      {/* Active */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[#eaf4ff] text-[#2563eb] flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs  sm:text-xs m font-medium text-slate-500">Active</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">{active}</div>
        </div>
      </div>

      {/* Frozen */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[#fff2e2] text-[#d97706] flex items-center justify-center shrink-0">
          <Snowflake className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs  sm:text-xs m font-medium text-slate-500">Frozen</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">{frozen}</div>
        </div>
      </div>

      {/* Jumbled */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[#f4ebff] text-[#7e22ce] flex items-center justify-center shrink-0">
          <Shuffle className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs  sm:text-xs m font-medium text-slate-500">Jumbled</div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">{jumbled}</div>
        </div>
      </div>
    </div>
  );
}
