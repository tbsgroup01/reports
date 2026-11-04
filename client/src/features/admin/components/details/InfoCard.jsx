import React, { useState } from "react";
import StatusBadge from "../../../../components/StatusBadge";
import { Info, Eye, EyeOff, Layers, FileText, ShieldAlert } from "lucide-react";

export default function InfoCard({ operator }) {
  const [showPassword, setShowPassword] = useState(true);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-xl bg-[#e3f4e8] text-[#118848] flex items-center justify-center">
            <Info className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">Operator Information</h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Operator identity, credentials, authorization level and platform status
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl">
            Operator ID: <strong className="text-slate-800 font-bold font-mono">#{operator.id || "1"}</strong>
          </span>
        </div>
      </div>

      {/* Full-Width Structured Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-3 sm:gap-4 text-xs">
        {/* 1. Name */}
        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:bg-slate-50 transition-colors">
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">
            Name
          </span>
          <span className="font-bold text-slate-900 text-sm truncate" title={operator.username}>
            {operator.username}
          </span>
        </div>

        {/* 2. Login ID / Email */}
        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:bg-slate-50 transition-colors">
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">
            Login ID
          </span>
          <span
            className="font-semibold text-slate-800 text-xs truncate"
            title={operator.email || `${operator.username}@gmail.com`}
          >
            {operator.email || `${operator.username}@gmail.com`}
          </span>
        </div>

        {/* 3. Password */}
        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">
              Password
            </span>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer transition-colors"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          </div>
          <span className="font-mono text-xs font-bold text-slate-800 truncate" title={operator.password}>
            {showPassword ? operator.password : "••••••••"}
          </span>
        </div>

        {/* 4. Access Level */}
        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:bg-slate-50 transition-colors">
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">
            Access Level
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-[#f3e8ff] text-[#7e22ce] w-fit">
            <Layers className="w-3 h-3" />
            <span>{operator.accessLevel || "Both"}</span>
          </span>
        </div>

        {/* 5. Report Model */}
        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:bg-slate-50 transition-colors">
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">
            Report Model
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 w-fit">
            <FileText className="w-3 h-3 text-slate-600" />
            <span>{operator.reportModel || "Medical"}</span>
          </span>
        </div>

        {/* 6. Account Status */}
        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:bg-slate-50 transition-colors">
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">
            Account Status
          </span>
          <div className="w-fit">
            <StatusBadge status={operator.accountStatus || operator.status || "Active"} />
          </div>
        </div>

        {/* 7. Data Status */}
        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:bg-slate-50 transition-colors">
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">
            Data Status
          </span>
          <div className="w-fit">
            <StatusBadge status={operator.dataStatus || "Clean"} />
          </div>
        </div>

        {/* 8. Denied Access */}
        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col justify-between hover:bg-slate-50 transition-colors">
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">
            Denied Access
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold w-fit ${
              operator.deniedAccess === "Yes"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
            }`}
          >
            {operator.deniedAccess || "No"}
          </span>
        </div>
      </div>
    </div>
  );
}
