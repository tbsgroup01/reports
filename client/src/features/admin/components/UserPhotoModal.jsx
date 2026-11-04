import React, { useEffect } from "react";
import { X, User, Mail, Shield, CheckCircle2 } from "lucide-react";
import { getOperatorAvatar } from "../../../utils/avatarUtils";

export default function UserPhotoModal({ isOpen, onClose, operator }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !operator) return null;

  const photoUrl = getOperatorAvatar(operator);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-slate-100 relative overflow-hidden animate-tab-fade">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#0e6b38]" />
            <span className="font-bold text-slate-900 text-sm">Operator Photo</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Photo Preview */}
        <div className="flex flex-col items-center text-center">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-emerald-500/30 shadow-lg bg-slate-100 mb-4 relative">
            <img
              src={photoUrl}
              alt={operator.username}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  operator.username
                )}&background=0e6b38&color=fff&rounded=true&bold=true`;
              }}
            />
          </div>

          <h3 className="text-xl font-bold text-slate-900 capitalize">
            {operator.username}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>{operator.email || `${operator.username}@gmail.com`}</span>
          </p>

          {/* Details Pills */}
          <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#0e6b38] border border-emerald-200">
              <Shield className="w-3 h-3" />
              <span>{operator.accessLevel || "Medical"}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Status: {operator.status || "Active"}</span>
            </span>

            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 font-mono">
              ID: #{operator.id}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

