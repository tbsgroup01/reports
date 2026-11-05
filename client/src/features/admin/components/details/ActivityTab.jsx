import React from "react";

export default function ActivityTab() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
      <h4 className="text-base font-bold text-slate-900 mb-4">Recent Operator Activity</h4>
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
          <div>
            <div className="text-xs  font-semibold text-slate-800">Account status set to Frozen</div>
            <div className="text-[11px] text-slate-400">03 Nov 2026, 11:20 AM • By Super Admin</div>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
          <div>
            <div className="text-xs  font-semibold text-slate-800">
              Assigned Domain Access: Both (Telecom & Medical)
            </div>
            <div className="text-[11px] text-slate-400">03 Nov 2026, 11:15 AM • By Super Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}

