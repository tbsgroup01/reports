import React from "react";

export default function OperatorNavbar({ operatorName = "John Doe", role = "Operator", onLogout }) {
  return (
    <header className="bg-[#111827] text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between">
        
        {/* Left Side: Brand Logo & Operator Portal */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Logo & Company Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                Greenerace
              </div>
              <div className="text-[10px] text-slate-400 font-normal">
                Technologies Pvt. Ltd.
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>

          {/* Operator Portal Title */}
          <div className="hidden sm:flex items-center gap-2 text-slate-200 text-sm font-medium">
            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
            </svg>
            <span>Operator Portal</span>
          </div>
        </div>

        {/* Right Side: Notification & User Profile */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button
            type="button"
            className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            title="Notifications"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#111827]"></span>
          </button>

          {/* Operator Profile */}
          <div className="flex items-center gap-2.5 pl-2">
            <div className="w-8 h-8 rounded-full bg-[#10b981] text-white flex items-center justify-center font-bold text-xs shadow-xs select-none">
              {operatorName.charAt(0)}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-xs font-bold text-white flex items-center gap-1">
                {operatorName}
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">{role}</div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}

