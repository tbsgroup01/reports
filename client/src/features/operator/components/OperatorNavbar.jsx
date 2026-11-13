import React from "react";
import logo from "../../../assets/logo.png";
import { Headphones, LogOut, Copy, Shuffle, Check, Stethoscope, Radio } from "lucide-react";

export default function OperatorNavbar({
    operatorName = "abdesh",
    role = "Operator (Medical)",
    onLogout,
    jobType = "both",
    activeDomain = "medical",
    onDomainChange,
    duplicateReport = false,
    onToggleDuplicate,
    jumbleUpReports = false,
    onToggleJumble,
}) {
    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            localStorage.removeItem("authToken");
            localStorage.removeItem("authUser");
            sessionStorage.clear();
            window.location.href = "/login";
        }
    };

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
            <div className="max-w-7xl 2xl:max-w-[1536px] w-full mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 flex-wrap">

                {/* Left Side: Brand Logo & Operator Portal */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {/* Official Abdiva Logo */}
                    <div className="flex items-center">
                        <img
                            src={logo}
                            alt="Abdiva Infotech"
                            className="h-12 sm:h-14 w-auto object-contain select-none"
                        />
                    </div>

                    {/* Divider */}
                    <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

                    {/* Operator Portal Title */}
                    <div className="hidden sm:flex items-center gap-1.5 text-slate-800 text-[12px] font-semibold">
                        <Headphones className="w-3.5 h-3.5 text-slate-700" />
                        <span>Operator Portal</span>
                    </div>
                </div>

                {/* Center / Right: Job Switcher, Mode Toggles, Profile & Logout */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap">
                    {/* Domain Switcher Tab (Medical vs Telecom) - Visible ONLY when Admin grants 'both' access */}
                    {jobType === "both" && onDomainChange && (
                        <div className="inline-flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200 shadow-2xs">
                            <button
                                type="button"
                                onClick={() => onDomainChange("medical")}
                                className={`px-2.5 py-1 rounded-lg text-[12px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${activeDomain === "medical"
                                    ? "bg-[#0e6b38] text-white shadow-xs font-bold scale-[1.02]"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                                    }`}
                            >
                                <Stethoscope className="w-3.5 h-3.5" />
                                <span>Medical</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => onDomainChange("telecom")}
                                className={`px-2.5 py-1 rounded-lg text-[12px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${activeDomain === "telecom"
                                    ? "bg-[#0e6b38] text-white shadow-xs font-bold scale-[1.02]"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                                    }`}
                            >
                                <Radio className="w-3.5 h-3.5" />
                                <span>Telecom</span>
                            </button>
                        </div>
                    )}

                    {/* {onToggleDuplicate && (
                        <button
                            type="button"
                            onClick={onToggleDuplicate}
                            title="Duplicate Report Mode"
                            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs ${duplicateReport
                                ? "bg-amber-500 text-white border-amber-600 font-bold"
                                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                                }`}
                        >
                            {duplicateReport ? (
                                <Check className="w-3 h-3 text-white stroke-[2.5]" />
                            ) : (
                                <Copy className="w-3 h-3 text-slate-400" />
                            )}
                            <span className="hidden sm:inline">Duplicate</span>
                        </button>
                    )}

                  
                    {onToggleJumble && (
                        <button
                            type="button"
                            onClick={onToggleJumble}
                            title="Jumble Reports Mode"
                            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs ${jumbleUpReports
                                ? "bg-purple-600 text-white border-purple-700 font-bold"
                                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                                }`}
                        >
                            {jumbleUpReports ? (
                                <Check className="w-3 h-3 text-white stroke-[2.5]" />
                            ) : (
                                <Shuffle className="w-3 h-3 text-slate-400" />
                            )}
                            <span className="hidden sm:inline">Jumble</span>
                        </button>
                    )} */}

                    {/* Operator Profile - Hello {operatorName} & Highlighted Role */}
                    <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
                        <div className="flex items-center gap-1.5 text-left">
                            <span className="text-[12px] font-medium text-slate-600 whitespace-nowrap">
                                Hello, <strong className="font-bold text-slate-900 capitalize">{operatorName}</strong>
                            </span>
                            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] shadow-2xs whitespace-nowrap">
                                {role}
                            </span>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 hover:text-rose-600 hover:border-rose-200 border border-slate-200 text-slate-700 font-semibold px-2.5 py-1 rounded-lg text-[12px] transition-all cursor-pointer shadow-2xs"
                        title="Logout"
                    >
                        <LogOut className="w-3 h-3 text-slate-500" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>

            </div>
        </header>
    );
}
