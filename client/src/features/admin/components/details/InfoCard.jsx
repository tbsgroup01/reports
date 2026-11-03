import React, { useState } from "react";
import StatusBadge from "../../../../components/StatusBadge";
import { Info, Eye, EyeOff, Layers, FileText } from "lucide-react";

export default function InfoCard({ operator }) {
  const [showPassword, setShowPassword] = useState(true);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <span className="w-5 h-5 rounded-full bg-[#e3f4e8] text-[#118848] flex items-center justify-center">
          <Info className="w-3.5 h-3.5" />
        </span>
        <h3 className="text-base font-bold text-slate-900">Operator Information</h3>
      </div>

      <div className="space-y-3.5 text-sm">
        {/* Name */}
        <div className="flex items-center justify-between py-1">
          <span className="text-slate-500 font-medium text-xs">Name</span>
          <span className="font-semibold text-slate-900">{operator.username}</span>
        </div>

        {/* Login ID */}
        <div className="flex items-center justify-between py-1 border-t border-slate-100">
          <span className="text-slate-500 font-medium text-xs">Login ID</span>
          <span className="font-semibold text-slate-900 text-xs sm:text-sm truncate max-w-[190px]">
            {operator.email || `${operator.username}@gmail.com`}
          </span>
        </div>

        {/* Password */}
        <div className="flex items-center justify-between py-1 border-t border-slate-100">
          <span className="text-slate-500 font-medium text-xs">Password</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-medium text-slate-800">
              {showPassword ? operator.password : "••••••••"}
            </span>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
              title={showPassword ? "Hide" : "Show"}
            >
              {showPassword ? (
                <Eye className="w-3.5 h-3.5" />
              ) : (
                <EyeOff className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Access Level */}
        <div className="flex items-center justify-between py-1 border-t border-slate-100">
          <span className="text-slate-500 font-medium text-xs">Access Level</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f3e8ff] text-[#7e22ce]">
            <Layers className="w-3 h-3" />
            {operator.accessLevel || "Both"}
          </span>
        </div>

        {/* Report Model */}
        <div className="flex items-center justify-between py-1 border-t border-slate-100">
          <span className="text-slate-500 font-medium text-xs">Report Model</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
            <FileText className="w-3 h-3 text-slate-600" />
            {operator.reportModel || "Medical"}
          </span>
        </div>

        {/* Account Status */}
        <div className="flex items-center justify-between py-1 border-t border-slate-100">
          <span className="text-slate-500 font-medium text-xs">Account Status</span>
          <StatusBadge status={operator.accountStatus || operator.status || "Frozen"} />
        </div>

        {/* Data Status */}
        <div className="flex items-center justify-between py-1 border-t border-slate-100">
          <span className="text-slate-500 font-medium text-xs">Data Status</span>
          <StatusBadge status={operator.dataStatus || "Clean"} />
        </div>

        {/* Denied Access */}
        <div className="flex items-center justify-between py-1 border-t border-slate-100">
          <span className="text-slate-500 font-medium text-xs">Denied Access</span>
          <span className="font-semibold text-slate-700">{operator.deniedAccess || "No"}</span>
        </div>
      </div>
    </div>
  );
}
