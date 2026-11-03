import React, { useRef } from "react";

export default function OperatorSubHeader({
  jobType = "both",
  activeDomain = "medical",
  onDomainChange,
  duplicateReport = false,
  onToggleDuplicate,
  jumbleUpReports = false,
  onToggleJumble,
  selectedImageName,
  onImageSelect,
  onLogout,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Job Type Badge & Domain Switcher (when job is 'both') */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
            Job: <span className="ml-1 text-slate-900 font-bold capitalize">{jobType}</span>
          </span>

          {/* Module Selector Pill */}
          {jobType === "both" && (
            <div className="inline-flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onDomainChange("medical")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeDomain === "medical"
                    ? "bg-[#0e6b38] text-white shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>🏥</span>
                <span>Medical</span>
              </button>

              <button
                type="button"
                onClick={() => onDomainChange("telecom")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeDomain === "telecom"
                    ? "bg-[#0e6b38] text-white shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>📡</span>
                <span>Telecom</span>
              </button>
            </div>
          )}

          {/* User Behavior Controls (Jumble & Duplicate per spec) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleDuplicate}
              title="When enabled, every submitted record automatically generates a duplicate record (2 API calls per spec)"
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                duplicateReport
                  ? "bg-amber-100 text-amber-800 border-amber-300 shadow-2xs font-bold"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{duplicateReport ? "✓" : "○"}</span>
              <span>Duplicate Mode</span>
            </button>

            <button
              type="button"
              onClick={onToggleJumble}
              title="When enabled, tests jumbled reports simulation per spec"
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                jumbleUpReports
                  ? "bg-purple-100 text-purple-800 border-purple-300 shadow-2xs font-bold"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{jumbleUpReports ? "✓" : "○"}</span>
              <span>Jumble Reports</span>
            </button>
          </div>
        </div>

        {/* Center: Review Image Upload */}
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="text-slate-700 font-medium whitespace-nowrap">Review Image:</span>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer shadow-2xs"
          >
            <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Choose File
          </button>

          <span className="text-xs text-slate-500 truncate max-w-[150px] sm:max-w-[200px]">
            {selectedImageName || "No file chosen"}
          </span>
        </div>

        {/* Right: Logout Button */}
        <div>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200 text-slate-700 font-semibold px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition-all cursor-pointer shadow-2xs"
          >
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}
