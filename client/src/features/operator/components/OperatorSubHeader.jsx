import React, { useRef } from "react";
import sampleDocImg from "../../../assets/sample-scanned-doc.jpg";
import {
  Stethoscope,
  Radio,
  Check,
  Circle,
  Upload,
  LogOut,
  Maximize2,
  FileText,
  Copy,
  Shuffle,
} from "lucide-react";

export default function OperatorSubHeader({
  jobType = "both",
  activeDomain = "medical",
  onDomainChange,
  duplicateReport = false,
  onToggleDuplicate,
  jumbleUpReports = false,
  onToggleJumble,
  selectedImageName,
  customImageSrc,
  onImageSelect,
  onOpenImageModal,
  onLogout,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const currentFileName = selectedImageName || "sample-scanned-doc.jpg";

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs sticky top-[57px] z-20">
      <div className="max-w-7xl 2xl:max-w-[1536px] w-full mx-auto px-3 sm:px-8 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">

        {/* Left Side: Job Authorization Badge & Source Document Upload Pill */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">

          {/* Job Authorization Status */}
          {jobType === "both" ? (
            <div className="inline-flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-2 pr-1">
                Job:
              </span>
              <button
                type="button"
                onClick={() => onDomainChange("medical")}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                  activeDomain === "medical"
                    ? "bg-[#0e6b38] text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Medical</span>
              </button>

              <button
                type="button"
                onClick={() => onDomainChange("telecom")}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                  activeDomain === "telecom"
                    ? "bg-[#0e6b38] text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Telecom</span>
              </button>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-semibold bg-emerald-50/90 text-emerald-800 border border-emerald-200/90 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>
                Job: <strong className="font-bold capitalize text-emerald-900">{jobType}</strong>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                Authorized
              </span>
            </div>
          )}

          <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

          {/* Source Document File Pill */}
          <div className="inline-flex items-center gap-1.5 bg-slate-50/90 hover:bg-slate-100/70 border border-slate-200/90 rounded-2xl p-1 pr-1.5 text-xs transition-all shadow-2xs">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,.pdf"
              className="hidden"
            />

            <div className="flex items-center gap-1.5 pl-2">
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span className="text-slate-500 font-medium text-[11px] hidden md:inline">Sheet:</span>
              <span
                className="font-mono text-slate-800 font-semibold bg-white px-2 py-0.5 rounded-lg border border-slate-200/80 truncate max-w-[130px] sm:max-w-[200px]"
                title={currentFileName}
              >
                {currentFileName}
              </span>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-slate-50 hover:text-emerald-700 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
              title="Upload custom document image"
            >
              <Upload className="w-3 h-3 text-slate-500" />
              <span>Choose</span>
            </button>

            {onOpenImageModal && (
              <button
                type="button"
                onClick={onOpenImageModal}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#0e6b38] hover:bg-[#0b542c] text-white font-semibold text-xs transition-all cursor-pointer shadow-2xs"
                title="Open document inspection lightbox"
              >
                <Maximize2 className="w-3 h-3" />
                <span className="hidden sm:inline">Inspect</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Operational Toggles (Duplicate & Jumble) + Logout */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">

          {/* Duplicate Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDuplicate}
            title="When enabled, every submitted record generates a duplicate record for verification"
            className={`text-xs font-semibold px-3 py-1.5 rounded-2xl border transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs ${
              duplicateReport
                ? "bg-amber-500 text-white border-amber-600 font-bold shadow-xs scale-[1.02]"
                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
            }`}
          >
            {duplicateReport ? (
              <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>Duplicate Mode</span>
          </button>

          {/* Jumble Reports Toggle */}
          <button
            type="button"
            onClick={onToggleJumble}
            title="When enabled, tests operator vigilance by slightly varying form structure"
            className={`text-xs font-semibold px-3 py-1.5 rounded-2xl border transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs ${
              jumbleUpReports
                ? "bg-purple-600 text-white border-purple-700 font-bold shadow-xs scale-[1.02]"
                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
            }`}
          >
            {jumbleUpReports ? (
              <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
            ) : (
              <Shuffle className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>Jumble Reports</span>
          </button>

          <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 text-slate-700 font-semibold px-3.5 py-1.5 rounded-2xl text-xs transition-all cursor-pointer shadow-2xs"
            title="Sign out of operator portal"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
            <span>Logout</span>
          </button>
        </div>

      </div>
    </div>
  );
}
