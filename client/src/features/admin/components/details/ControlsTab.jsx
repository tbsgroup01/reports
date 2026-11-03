import React from "react";

export default function ControlsTab({ operator, onToggleFreeze }) {
  const isFrozen = operator.accountStatus === "Frozen" || operator.status === "Frozen";

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
      <h4 className="text-base font-bold text-slate-900 mb-2">Remote Controls & Permissions</h4>

      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div>
          <div className="text-sm font-semibold text-slate-800">Freeze Operator Workstation</div>
          <div className="text-xs text-slate-500">
            Temporarily prevent this operator from picking up new records
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleFreeze}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
            isFrozen
              ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
        >
          {isFrozen ? "Unfreeze" : "Freeze"}
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div>
          <div className="text-sm font-semibold text-slate-800">Jumble Form Fields</div>
          <div className="text-xs text-slate-500">
            Test operator vigilance by slightly randomizing form field sequence
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
          Enabled
        </span>
      </div>
    </div>
  );
}

