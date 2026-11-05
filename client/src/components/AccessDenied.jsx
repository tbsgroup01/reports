import React from "react";
import { ShieldAlert, ArrowLeft, LogOut, Lock } from "lucide-react";
import logoImg from "../assets/logo.png";

export default function AccessDenied({
  currentUser,
  targetRole, // "admin" | "operator"
  onNavigate,
  onLogout,
}) {
  const isOperatorTryingAdmin = targetRole === "admin";
  const userRole = currentUser?.role || "user";
  const username = currentUser?.username || currentUser?.email || "User";

  const redirectPath =
    userRole === "admin"
      ? "/admin"
      : currentUser?.accessLevel === "Medical"
      ? "/operator/medical"
      : "/operator/telecom";

  const redirectLabel =
    userRole === "admin"
      ? "Go to Super Admin Console"
      : "Go to Operator Workspace";

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-between">
      {/* Top Bar */}
      <header className="w-full bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={logoImg}
            alt="Abdiva Infotech"
            className="h-10 sm:h-12 object-contain cursor-pointer"
            onClick={() => onNavigate("/")}
          />
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
            Security & Access Control
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 font-medium">
            Signed in as: <strong className="text-slate-900 capitalize">{username}</strong> ({userRole})
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-rose-600 cursor-pointer shadow-2xs transition-colors ml-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Restricted Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 uppercase tracking-wider mb-2">
            <Lock className="w-3 h-3" /> 403 Forbidden
          </span>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
            Access Restricted
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
            {isOperatorTryingAdmin ? (
              <>
                You are currently logged in with an <strong>Operator</strong> account (
                <span className="font-semibold text-slate-800">{username}</span>). Operator accounts are strictly prohibited from accessing the <strong>Super Admin Management Portal</strong>.
              </>
            ) : (
              <>
                You are currently logged in with a <strong>Super Admin</strong> account (
                <span className="font-semibold text-slate-800">{username}</span>). Administrative accounts cannot access the <strong>Operator Data Entry Workspace</strong> directly.
              </>
            )}
          </p>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => onNavigate(redirectPath)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0e6b38] hover:bg-[#0b542c] text-white font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{redirectLabel}</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch Account / Sign In with Different Role</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("/")}
              className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-4 cursor-pointer pt-1"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
        © 2026 Abdiva Infotech Pvt Ltd. Role-Based Access Enforcement active.
      </footer>
    </div>
  );
}

