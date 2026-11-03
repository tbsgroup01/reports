import React, { useState } from "react";
import StatusBadge from "../../../../components/StatusBadge";

export default function InfoCard({ operator }) {
  const [showPassword, setShowPassword] = useState(true);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <span className="w-5 h-5 rounded-full bg-[#e3f4e8] text-[#118848] flex items-center justify-center text-xs font-bold">
          ⓘ
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Access Level */}
        <div className="flex items-center justify-between py-1 border-t border-slate-100">
          <span className="text-slate-500 font-medium text-xs">Access Level</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f3e8ff] text-[#7e22ce]">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {operator.accessLevel || "Both"}
          </span>
        </div>

        {/* Report Model */}
        <div className="flex items-center justify-between py-1 border-t border-slate-100">
          <span className="text-slate-500 font-medium text-xs">Report Model</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
            <svg className="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
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

