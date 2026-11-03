import React from "react";

export default function StatusBadge({ status, type }) {
  // Pill badges for user behaviors (FROZEN, JUMBLED)
  if (type === "badge") {
    if (status === "FROZEN") {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#ffeed9] text-[#b45309] uppercase tracking-wide">
          FROZEN
        </span>
      );
    }
    if (status === "JUMBLED") {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#f3e8ff] text-[#7e22ce] uppercase tracking-wide">
          JUMBLED
        </span>
      );
    }
    return null;
  }

  // Row status badges (Active, Frozen, Denied, Clean)
  if (status === "Active") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#e7f7ed] text-[#118848]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#118848]"></span>
        Active
      </span>
    );
  }

  if (status === "Frozen") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fff2e2] text-[#d97706]">
        <span className="text-xs">❄</span>
        Frozen
      </span>
    );
  }

  if (status === "Denied") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fee2e2] text-[#b91c1c]">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Denied
      </span>
    );
  }

  if (status === "Clean") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e7f7ed] text-[#118848]">
        <span>✔</span>
        Clean
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
      {status}
    </span>
  );
}

