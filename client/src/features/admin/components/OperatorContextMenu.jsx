import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Eye,
  Check,
  Ban,
  RotateCcw,
  Snowflake,
  Shuffle,
  Copy,
  Code2,
  BarChart3,
  TrendingDown,
  Trash2,
} from "lucide-react";

export default function OperatorContextMenu({
  operator,
  buttonRef,
  onClose,
  onViewDetails,
  onGrantAccess,
  onDenyAccess,
  onResetPassword,
  onToggleFreeze,
  onToggleJumble,
  onDelete,
}) {
  const menuRef = useRef(null);
  const [style, setStyle] = useState({ top: 0, left: 0, opacity: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (!buttonRef?.current) return;
      const btnRect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 224; // w-56 = 14rem = 224px
      const menuHeight = menuRef.current?.offsetHeight || 370;

      const spaceBelow = window.innerHeight - btnRect.bottom;
      const spaceAbove = btnRect.top;

      let top;
      // If there's enough space below, or more space below than above, position below
      if (spaceBelow >= menuHeight || spaceBelow >= spaceAbove) {
        top = btnRect.bottom + 6;
      } else {
        // Otherwise position above
        top = btnRect.top - menuHeight - 6;
      }

      // Ensure it never goes off-screen at the top or bottom
      if (top < 12) {
        top = 12;
      } else if (top + menuHeight > window.innerHeight - 12) {
        top = Math.max(12, window.innerHeight - menuHeight - 12);
      }

      // Align right edge of menu with right edge of button
      let left = btnRect.right - menuWidth;
      // Ensure horizontal bounds
      if (left < 12) {
        left = 12;
      } else if (left + menuWidth > window.innerWidth - 12) {
        left = window.innerWidth - menuWidth - 12;
      }

      setStyle({
        top,
        left,
        opacity: 1,
      });
    };

    updatePosition();

    // Recalculate on scroll or window resize
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    // Close when clicking outside menu and button
    const handlePointerDown = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        if (onClose) onClose();
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);

    // Close on Escape key
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (onClose) onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [buttonRef, onClose]);

  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: `${style.top}px`,
        left: `${style.left}px`,
        opacity: style.opacity,
        zIndex: 99999,
      }}
      className="w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 text-left ring-1 ring-black/10 transition-opacity duration-100 max-h-[calc(100vh-24px)] overflow-y-auto"
    >
      {/* View Details Option */}
      <button
        type="button"
        onClick={() => {
          onViewDetails(operator);
          if (onClose) onClose();
        }}
        className="w-full px-3.5 py-1.5 text-xs  font-semibold text-slate-800 hover:bg-emerald-50 hover:text-[#118848] flex items-center gap-2.5 transition-colors cursor-pointer border-b border-slate-100 mb-1"
      >
        <Eye className="w-3.5 h-3.5 text-[#118848] shrink-0" />
        <span>View Operator Details</span>
      </button>

      {/* Section: Access Control */}
      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        Access Control
      </div>
      <button
        type="button"
        onClick={() => {
          onGrantAccess(operator.id);
          if (onClose) onClose();
        }}
        className="w-full px-3.5 py-1 text-xs  text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2.5 transition-colors cursor-pointer"
      >
        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Grant Access</span>
      </button>
      <button
        type="button"
        onClick={() => {
          onDenyAccess(operator.id);
          if (onClose) onClose();
        }}
        className="w-full px-3.5 py-1 text-xs  text-slate-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-2.5 transition-colors cursor-pointer"
      >
        <Ban className="w-3.5 h-3.5 text-red-500 shrink-0" />
        <span>Deny Access</span>
      </button>
      <button
        type="button"
        onClick={() => {
          onResetPassword(operator.id);
          if (onClose) onClose();
        }}
        className="w-full px-3.5 py-1 text-xs  text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span>{operator.password ? "Reset Password" : "Set Password"}</span>
      </button>

      {/* Section: User Behavior */}
      <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-t border-slate-100 mt-1">
        User Behavior
      </div>
      <button
        type="button"
        onClick={() => {
          onToggleFreeze(operator.id);
          if (onClose) onClose();
        }}
        className="w-full px-3.5 py-1 text-xs  text-slate-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2.5 transition-colors cursor-pointer"
      >
        <Snowflake className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span>{operator.status === "Frozen" ? "Unfreeze User" : "Freeze User"}</span>
      </button>
      <button
        type="button"
        onClick={() => {
          onToggleJumble(operator.id);
          if (onClose) onClose();
        }}
        className="w-full px-3.5 py-1 text-xs  text-slate-700 hover:bg-purple-50 hover:text-purple-800 flex items-center gap-2.5 transition-colors cursor-pointer"
      >
        <Shuffle className="w-3.5 h-3.5 text-purple-500 shrink-0" />
        <span>{operator.badges.includes("JUMBLED") ? "Disable Jumble" : "Enable Jumble"}</span>
      </button>

      {/* Section: Data Actions */}
      <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-t border-slate-100 mt-1">
        Data Actions
      </div>
      <button
        type="button"
        onClick={() => {
          alert(`Duplicate data mode enabled for ${operator.username}`);
          if (onClose) onClose();
        }}
        className="w-full px-3.5 py-1 text-xs  text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
      >
        <Copy className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>Enable Duplicate</span>
      </button>




      {/* Delete Option */}
      <div className="border-t border-slate-100 mt-1.5 pt-1">
        <button
          type="button"
          onClick={() => {
            onDelete(operator.id);
            if (onClose) onClose();
          }}
          className="w-full px-3.5 py-1.5 text-xs  font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
          <span>Delete Operator</span>
        </button>
      </div>
    </div>,
    document.body
  );
}
