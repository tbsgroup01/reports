import React from "react";
import { Globe, Headphones, Bell, LogOut } from "lucide-react";

export default function OperatorNavbar({ operatorName = "John Doe", role = "Operator", onLogout }) {
  return (
    <header className="bg-[#111827] text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between">
        
        {/* Left Side: Brand Logo & Operator Portal */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Logo & Company Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
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
            <Headphones className="w-4 h-4 text-slate-300" />
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
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#111827]"></span>
          </button>

          {/* Operator Profile */}
          <div className="flex items-center gap-2.5 pl-2">
            <div className="w-8 h-8 rounded-full bg-[#10b981] text-white flex items-center justify-center font-bold text-xs shadow-xs select-none">
              {operatorName.charAt(0)}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-xs font-semibold text-white">{operatorName}</div>
              <div className="text-[10px] text-slate-400">{role}</div>
            </div>
          </div>

          {/* Quick Logout if provided */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
