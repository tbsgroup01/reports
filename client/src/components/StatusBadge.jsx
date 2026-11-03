import React from "react";
import { Snowflake, Lock, Check } from "lucide-react";

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
        <Snowflake className="w-3 h-3 text-[#d97706]" />
        Frozen
      </span>
    );
  }

  if (status === "Denied") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fee2e2] text-[#b91c1c]">
        <Lock className="w-3 h-3 text-[#b91c1c]" />
        Denied
      </span>
    );
  }

  if (status === "Clean") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e7f7ed] text-[#118848]">
        <Check className="w-3 h-3 text-[#118848]" />
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
