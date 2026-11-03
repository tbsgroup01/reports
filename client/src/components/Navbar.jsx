import React from "react";
import logo from "../assets/logo.png";
import { Bell } from "lucide-react";

export default function Navbar({ onLogoClick }) {
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

        {/* Right Section: Notification & Super Admin Avatar */}
        <div className="flex items-center gap-5">
          {/* Notification Bell */}
          <button
            type="button"
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-[#0a5c32] text-white flex items-center justify-center font-bold text-sm shadow-xs select-none">
              A
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-bold text-slate-900 leading-tight">Admin</div>
              <div className="text-[11px] text-slate-500 font-medium">Super Admin</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
