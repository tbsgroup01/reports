import React from "react";

export default function OperatorContextMenu({
  operator,
  menuRef,
  onViewDetails,
  onGrantAccess,
  onDenyAccess,
  onResetPassword,
  onToggleFreeze,
  onToggleJumble,
  onDelete,
}) {
  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-10 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2.5 z-50 text-left animate-in fade-in zoom-in-95 duration-150"
    >
      {/* View Details Option */}
      <button
        type="button"
        onClick={() => onViewDetails(operator)}
        className="w-full px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-emerald-50 hover:text-[#118848] flex items-center gap-2.5 transition-colors cursor-pointer border-b border-slate-100 mb-1"
      >
        <svg className="w-4 h-4 text-[#118848]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        View Operator Details
      </button>

      {/* Section: Access Control */}
      <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        Access Control
      </div>
      <button
        type="button"
        onClick={() => onGrantAccess(operator.id)}
        className="w-full px-3.5 py-1.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2.5 transition-colors cursor-pointer"
      >
        <span className="text-emerald-600 text-sm">✔</span>
        Grant Access
      </button>
      <button
        type="button"
        onClick={() => onDenyAccess(operator.id)}
        className="w-full px-3.5 py-1.5 text-xs text-slate-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-2.5 transition-colors cursor-pointer"
      >
        <span className="text-red-500 text-sm">⊘</span>
        Deny Access
      </button>
      <button
        type="button"
        onClick={() => onResetPassword(operator.id)}
        className="w-full px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
      >
        <span className="text-slate-500 text-xs">🔄</span>
        Reset Password
      </button>

      {/* Section: User Behavior */}
      <div className="px-3 pt-2.5 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-t border-slate-100 mt-1">
        User Behavior
      </div>
      <button
        type="button"
        onClick={() => onToggleFreeze(operator.id)}
        className="w-full px-3.5 py-1.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2.5 transition-colors cursor-pointer"
      >
        <span className="text-amber-500 text-xs">❄</span>
        {operator.status === "Frozen" ? "Unfreeze User" : "Freeze User"}
      </button>
      <button
        type="button"
        onClick={() => onToggleJumble(operator.id)}
        className="w-full px-3.5 py-1.5 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-800 flex items-center gap-2.5 transition-colors cursor-pointer"
      >
        <span className="text-purple-500 text-xs">🔀</span>
        {operator.badges.includes("JUMBLED") ? "Disable Jumble" : "Enable Jumble"}
      </button>

      {/* Section: Data Actions */}
      <div className="px-3 pt-2.5 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-t border-slate-100 mt-1">
        Data Actions
      </div>
      <button
        type="button"
        onClick={() => alert(`Duplicate data mode enabled for ${operator.username}`)}
        className="w-full px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
      >
        <span className="text-slate-400 text-xs">📋</span>
        Enable Duplicate
      </button>
      <button
        type="button"
        onClick={() => alert(`Corrupt data simulation applied for ${operator.username}`)}
        className="w-full px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
      >
        <span className="text-slate-400 font-mono text-xs">&lt;/&gt;</span>
        Corrupt Data
      </button>

      {/* Section: Report */}
      <div className="px-3 pt-2.5 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-t border-slate-100 mt-1">
        Report
      </div>
      <button
        type="button"
        onClick={() => alert(`Report access granted for ${operator.username}`)}
        className="w-full px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
      >
        <span className="text-emerald-500 text-xs">📊</span>
        Grant Report
      </button>
      <button
        type="button"
        onClick={() => alert(`Report access denied for ${operator.username}`)}
        className="w-full px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
      >
        <span className="text-rose-500 text-xs">📉</span>
        Deny Report
      </button>

      {/* Delete Option */}
      <div className="border-t border-slate-100 mt-1.5 pt-1">
        <button
          type="button"
          onClick={() => onDelete(operator.id)}
          className="w-full px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete Operator
        </button>
      </div>
    </div>
  );
}

