import React from "react";
import logo from "../assets/logo.png";
import { Bell, LogOut } from "lucide-react";

export default function Navbar({ onLogoClick, username, role, onLogout }) {
  // Read authenticated user from localStorage if not provided via props
  const user = (() => {
    try {
      const u = localStorage.getItem("authUser");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();

  const displayName = username || user?.username || "Admin";
  const displayRole = role || user?.role || "Super Admin";

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
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <div
          className={`flex items-center ${onLogoClick ? "cursor-pointer" : ""}`}
          onClick={onLogoClick}
        >
          <img
            src={logo}
            alt="Abdiva Infotech"
            className="h-9 sm:h-10 w-auto object-contain select-none"
          />
        </div>

        {/* Right Section: Notification, User Greeting, & Logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Notification Bell */}
          {/* <button
            type="button"
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button> */}

          {/* User Profile - Hello {username} & Highlighted Role */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-left">
              <span className="text-xs sm:text-sm font-medium text-slate-600 whitespace-nowrap">
                Hello, <strong className="font-bold text-slate-900 capitalize">{displayName}</strong>
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] shadow-2xs whitespace-nowrap">
                {displayRole}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 hover:text-rose-600 hover:border-rose-200 border border-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer shadow-2xs ml-1"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
