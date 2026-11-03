import React from "react";
import logo from "../assets/logo.png";

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
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
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

