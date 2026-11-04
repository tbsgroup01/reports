import React from "react";
import logo from "../../../assets/logo.png";
import { Headphones, Bell, LogOut } from "lucide-react";

export default function OperatorNavbar({ operatorName = "abdesh", role = "Operator (Medical)", onLogout }) {
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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2">

        {/* Left Side: Brand Logo & Operator Portal */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Official Abdiva Logo */}
          <div className="flex items-center">
            <img
              src={logo}
              alt="Abdiva Infotech"
              className="h-7 sm:h-9 w-auto object-contain select-none"
            />
          </div>

          {/* Divider */}
          <div className="h-4 sm:h-5 w-px bg-slate-200 hidden sm:block"></div>

          {/* Operator Portal Title */}
          <div className="hidden sm:flex items-center gap-1.5 text-slate-800 text-xs sm:text-sm font-semibold">
            <Headphones className="w-3.5 h-3.5 text-slate-700" />
            <span>Operator Portal</span>
          </div>
        </div>

        {/* Right Side: Notification, User Greeting & Logout */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Notification Bell with red indicator */}
          {/* <button
            type="button"
            className="relative p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button> */}

          {/* Operator Profile - Hello {operatorName} & Highlighted Role */}
          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
            <div className="flex items-center gap-1.5 sm:gap-2 text-left">
              <span className="text-xs sm:text-sm font-medium text-slate-600 whitespace-nowrap">
                Hello, <strong className="font-bold text-slate-900 capitalize">{operatorName}</strong>
              </span>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] shadow-2xs whitespace-nowrap">
                {role}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 hover:text-rose-600 hover:border-rose-200 border border-slate-200 text-slate-700 font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer shadow-2xs"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

      </div>
    </header>
  );
}
