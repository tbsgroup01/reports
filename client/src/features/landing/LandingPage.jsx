import React, { useState } from "react";
import logoImg from "../../assets/logo.png";
import laptopShowcaseGreenImg from "../../assets/laptop-showcase-green.png";
import streamMedicalImg from "../../assets/stream-medical.png";
import streamTelecomImg from "../../assets/stream-telecom.png";
import ctaOperatorImg from "../../assets/cta-operator.png";
import {
  FileText,
  Radio,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  LogIn,
  LogOut,
  Lock,
  Layers,
  Zap,
  BarChart3,
  Users,
  Check,
  ChevronDown,
  Activity,
  UploadCloud,
  CheckSquare,
  Database,
  Monitor,
  Shuffle,
  UserPlus,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

export default function LandingPage({
  currentUser,
  onNavigate,
  onLogout,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = !!currentUser;
  const userRole = currentUser?.role;
  const username = currentUser?.username || currentUser?.email || "User";

  const handlePortalRedirect = () => {
    if (!isLoggedIn) {
      onNavigate("/login");
      return;
    }
    if (userRole === "admin") {
      onNavigate("/admin");
    } else if (currentUser?.accessLevel === "Medical") {
      onNavigate("/operator/medical");
    } else {
      onNavigate("/operator/telecom");
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen w-full bg-white text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">

      {/* ========================================================= */}
      {/* 1. TOP NAVIGATION BAR                                     */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">

          {/* Left: Brand Logo + Version Pill */}
          <div
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none shrink-0"
            onClick={() => onNavigate("/")}
          >
            <img
              src={logoImg}
              alt="Abdiva Infotech Pvt Ltd"
              className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-emerald-50 text-[#0e6b38] border border-emerald-200/80">
              Enterprise v2.4
            </span>
          </div>

          {/* Center Links (Desktop >= lg) */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium text-slate-600">
            <a
              href="#home"
              className="text-[#0e6b38] font-bold relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:h-0.5 after:bg-[#0e6b38] after:rounded-full"
            >
              Home
            </a>
            <a href="#features" className="hover:text-[#0e6b38] transition-colors">
              Features
            </a>
            <div className="flex items-center gap-1 hover:text-[#0e6b38] transition-colors cursor-pointer group">
              <a href="#solutions">Solutions</a>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0e6b38] transition-colors" />
            </div>
            <a href="#workflow" className="hover:text-[#0e6b38] transition-colors">
              Workflow
            </a>
            <a href="#security" className="hover:text-[#0e6b38] transition-colors">
              Security
            </a>
          </nav>

          {/* Right Action CTAs (Desktop & Tablet) */}
          <div className="hidden sm:flex items-center gap-2.5">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="hidden md:inline-flex text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  {username} ({userRole === "admin" ? "Admin" : "Operator"})
                </span>
                <button
                  type="button"
                  onClick={handlePortalRedirect}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#0e6b38] hover:bg-[#0b542c] transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 active:scale-95"
                >
                  <span>Go to Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-2 rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate("/register")}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
                >
                  Operator Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("/login")}
                  className="px-4.5 py-2 rounded-full text-xs font-semibold text-white bg-[#0e6b38] hover:bg-[#0b542c] transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 active:scale-95"
                >
                  <span>Login to Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Right Controls (< sm: Login Button + Hamburger) */}
          <div className="flex sm:hidden items-center gap-2">
            {!isLoggedIn ? (
              <button
                type="button"
                onClick={() => onNavigate("/login")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0e6b38] hover:bg-[#0b542c] transition-all cursor-pointer shadow-2xs flex items-center gap-1"
              >
                <span>Login</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePortalRedirect}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0e6b38] hover:bg-[#0b542c] transition-all cursor-pointer shadow-2xs flex items-center gap-1"
              >
                <span>Portal</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-700" />
              ) : (
                <Menu className="w-5 h-5 text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-100 bg-white/98 backdrop-blur-md px-4 py-4 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
            {/* Nav links */}
            <nav className="flex flex-col space-y-2.5 text-sm font-medium text-slate-700">
              <a
                href="#home"
                onClick={closeMobileMenu}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-[#0e6b38] transition-colors"
              >
                <span>Home</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
              <a
                href="#features"
                onClick={closeMobileMenu}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-[#0e6b38] transition-colors"
              >
                <span>Platform Capabilities</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
              <a
                href="#solutions"
                onClick={closeMobileMenu}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-[#0e6b38] transition-colors"
              >
                <span>Operational Streams (Medical &amp; Telecom)</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
              <a
                href="#workflow"
                onClick={closeMobileMenu}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-[#0e6b38] transition-colors"
              >
                <span>How It Works (Workflow)</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
              <a
                href="#security"
                onClick={closeMobileMenu}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-[#0e6b38] transition-colors"
              >
                <span>Security &amp; Architecture</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            </nav>

            {/* Mobile Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <div className="text-xs text-slate-500 px-3 py-1">
                    Signed in as <strong className="text-slate-800">{username}</strong> ({userRole})
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      closeMobileMenu();
                      handlePortalRedirect();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#0e6b38] hover:bg-[#0b542c]"
                  >
                    <span>Open Operator Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeMobileMenu();
                      onLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      closeMobileMenu();
                      onNavigate("/login");
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#0e6b38] hover:bg-[#0b542c]"
                  >
                    <span>Login to Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeMobileMenu();
                      onNavigate("/register");
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-slate-500" />
                    <span>New Operator Registration</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* 2. HERO SECTION                                           */}
      {/* ========================================================= */}
      <section
        id="home"
        className="relative w-full pt-6 sm:pt-10 pb-12 sm:pb-16 bg-gradient-to-b from-emerald-100/60 via-emerald-50/40 to-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

            {/* Left Content (Cols 7) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">

              {/* Badge Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-[#0e6b38] mx-auto lg:mx-0">
                <Activity className="w-3.5 h-3.5 text-[#0e6b38]" />
                <span>Next-Gen Record Automation &amp; Supervisory QA</span>
              </div>

              {/* H1 Heading */}
              <h1 className="text-2xl sm:text-4xl lg:text-[50px] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Transform Scanned Documents <br className="hidden sm:inline" />
                into <span className="text-[#0e6b38]">Verified Digital Records</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                A secure, high-speed enterprise platform for{" "}
                <strong className="text-slate-900 font-semibold">
                  &ldquo;Clinical Medical Prescriptions&rdquo;
                </strong>{" "}
                and{" "}
                <strong className="text-slate-900 font-semibold">
                  &ldquo;Telecom Subscriber Accounts&rdquo;
                </strong>
                , with full data entry, QA, workflow control and real-time supervision.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-1 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handlePortalRedirect}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0e6b38] hover:bg-[#0b542c] text-white px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer hover:shadow-lg active:scale-[0.98]"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Login to Portal</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("/register")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer hover:border-slate-300"
                >
                  <UserPlus className="w-4 h-4 text-slate-500" />
                  <span>New Operator Registration</span>
                </button>
              </div>

              {/* Key Feature Checks Pill Row */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center lg:justify-start gap-2 pt-2 text-[11px] sm:text-xs font-medium text-slate-700">
                <span className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-2.5 py-1 rounded-full bg-slate-50/90 border border-slate-200/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0e6b38] shrink-0" />
                  <span>High Accuracy</span>
                </span>
                <span className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-2.5 py-1 rounded-full bg-slate-50/90 border border-slate-200/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0e6b38] shrink-0" />
                  <span>Fast Data Entry</span>
                </span>
                <span className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-2.5 py-1 rounded-full bg-slate-50/90 border border-slate-200/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0e6b38] shrink-0" />
                  <span>Role-Based Access</span>
                </span>
                <span className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-2.5 py-1 rounded-full bg-slate-50/90 border border-slate-200/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0e6b38] shrink-0" />
                  <span>QA &amp; Audit Trail</span>
                </span>
              </div>

              {/* 4 Key Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-slate-200/80 text-left">
                <div className="flex items-center gap-2 sm:gap-2.5 p-2 rounded-xl bg-white/60 sm:bg-transparent border sm:border-0 border-slate-100">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-[#0e6b38] flex items-center justify-center shrink-0 border border-emerald-200/60">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">99.98%</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">Validation Accuracy</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5 p-2 rounded-xl bg-white/60 sm:bg-transparent border sm:border-0 border-slate-100">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-[#0e6b38] flex items-center justify-center shrink-0 border border-emerald-200/60">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">&lt; 1.2s</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">Record Entry Speed</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5 p-2 rounded-xl bg-white/60 sm:bg-transparent border sm:border-0 border-slate-100">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-[#0e6b38] flex items-center justify-center shrink-0 border border-emerald-200/60">
                    <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">100%</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">Role Isolated RBAC</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5 p-2 rounded-xl bg-white/60 sm:bg-transparent border sm:border-0 border-slate-100">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-[#0e6b38] flex items-center justify-center shrink-0 border border-emerald-200/60">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">24/7</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">Platform Availability</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual (Cols 5): Hero Laptop Desk Showcase (Green Ambient Shadow, Zero Dark Box) */}
            <div className="lg:col-span-5 relative flex items-center justify-center mt-6 lg:mt-0 w-full max-w-lg lg:max-w-none mx-auto">
              {/* Vibrant greenest ambient glows & shadows */}
              <div className="absolute w-[125%] h-[125%] -top-8 -right-6 bg-gradient-to-br from-emerald-400/35 via-emerald-300/25 to-teal-200/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute w-[90%] h-[90%] bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute inset-0 bg-emerald-300/15 rounded-full blur-xl pointer-events-none" />

              {/* Showcase Container with lush green shadow */}
              <div className="relative z-10 w-full rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-xs transition-transform duration-300 hover:scale-[1.015]">
                <img
                  src={laptopShowcaseGreenImg}
                  alt="Abdiva Infotech Operator Workspace"
                  className="w-full h-auto object-cover select-none block"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. TWO SPECIALIZED OPERATIONAL STREAMS                     */}
      {/* ========================================================= */}
      <section id="solutions" className="py-10 sm:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#0e6b38] border border-emerald-200/80">
              Our Solutions
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Two Specialized Operational Streams
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Engineered for complex, high-volume data entry with accuracy, speed, and complete operational control.
            </p>
          </div>

          {/* 2 Solution Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">

            {/* Stream 1: Medical Digitization */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-5 items-stretch hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="w-full sm:w-44 h-48 sm:h-auto rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-100">
                <img
                  src={streamMedicalImg}
                  alt="Clinical Medical Digitization"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#0e6b38] border border-emerald-200 flex items-center justify-center font-bold text-sm">
                    +
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Clinical Medical Digitization
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Digitize doctor prescriptions and clinical records with high accuracy and structured output.
                  </p>

                  <ul className="space-y-1.5 pt-1 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#0e6b38] shrink-0" />
                      <span>Prescription &amp; clinical record data entry</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#0e6b38] shrink-0" />
                      <span>Diagnosis, dosage &amp; unit capture</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#0e6b38] shrink-0" />
                      <span>Automated validations &amp; discrepancy checks</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#0e6b38] shrink-0" />
                      <span>Audit-ready digital records</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handlePortalRedirect}
                  className="w-9 h-9 rounded-full bg-[#0e6b38] hover:bg-[#0b542c] text-white flex items-center justify-center self-end transition-transform hover:scale-110 cursor-pointer shadow-2xs active:scale-95"
                  title="Open Medical Workflow"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stream 2: Telecom Automation */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-5 items-stretch hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="w-full sm:w-44 h-48 sm:h-auto rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-100">
                <img
                  src={streamTelecomImg}
                  alt="Telecom Sales Automation"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#0e6b38] border border-emerald-200 flex items-center justify-center">
                    <Radio className="w-4 h-4 text-[#0e6b38]" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Telecom Sales Automation
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Full-scheme subscriber account management with 21-point data capture and verification.
                  </p>

                  <ul className="space-y-1.5 pt-1 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#0e6b38] shrink-0" />
                      <span>Subscriber profile &amp; plan details entry</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#0e6b38] shrink-0" />
                      <span>Device &amp; price plan validation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#0e6b38] shrink-0" />
                      <span>Real-time checks &amp; duplicate control</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#0e6b38] shrink-0" />
                      <span>Live scan sheet &amp; batch tracking</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handlePortalRedirect}
                  className="w-9 h-9 rounded-full bg-[#0e6b38] hover:bg-[#0b542c] text-white flex items-center justify-center self-end transition-transform hover:scale-110 cursor-pointer shadow-2xs active:scale-95"
                  title="Open Telecom Workflow"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. POWERFUL PLATFORM CAPABILITIES                         */}
      {/* ========================================================= */}
      <section id="features" className="py-10 sm:py-14 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Header Column */}
            <div className="lg:col-span-4 space-y-3 text-center lg:text-left">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#0e6b38] border border-emerald-200/80">
                Why Abdiva
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                Powerful Platform Capabilities
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto lg:mx-0">
                Built for scale, accuracy and operational excellence across distributed data teams.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handlePortalRedirect}
                  className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-full border border-slate-300 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 transition-colors cursor-pointer shadow-2xs"
                >
                  <span>Explore All Features</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right: 6 Capability Cards Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">

              {/* 1. Role-Based Access */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-2 hover:shadow-xs transition-shadow">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0e6b38] flex items-center justify-center border border-emerald-200/60">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Role-Based Access
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Secure, isolated access for Admins, Supervisors &amp; Operators.
                </p>
              </div>

              {/* 2. Real-Time Monitoring */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-2 hover:shadow-xs transition-shadow">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0e6b38] flex items-center justify-center border border-emerald-200/60">
                  <Monitor className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Real-Time Monitoring
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Live progress, productivity and operator quality metrics.
                </p>
              </div>

              {/* 3. Multi-Level QA */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-2 hover:shadow-xs transition-shadow">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0e6b38] flex items-center justify-center border border-emerald-200/60">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Multi-Level QA
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Automated validations &amp; supervisory checks with remarks.
                </p>
              </div>

              {/* 4. Jumble & Duplicate Mode */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-2 hover:shadow-xs transition-shadow">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0e6b38] flex items-center justify-center border border-emerald-200/60">
                  <Shuffle className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Jumble &amp; Duplicate Mode
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Randomized record delivery to guarantee unbiased data entry.
                </p>
              </div>

              {/* 5. Reports & Analytics */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-2 hover:shadow-xs transition-shadow">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0e6b38] flex items-center justify-center border border-emerald-200/60">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Reports &amp; Analytics
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Comprehensive performance, accuracy and operational exports.
                </p>
              </div>

              {/* 6. Scalable & Secure */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-2 hover:shadow-xs transition-shadow">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0e6b38] flex items-center justify-center border border-emerald-200/60">
                  <Lock className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Scalable &amp; Secure
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enterprise-grade security, encrypted payloads and full audit logs.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. SIMPLE OPERATIONAL WORKFLOW (CURVED EMERALD SECTION)   */}
      {/* ========================================================= */}
      <section id="workflow" className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#093d22] text-white py-10 sm:py-14 px-5 sm:px-10 rounded-[28px] sm:rounded-[36px] shadow-lg relative overflow-hidden">

          {/* Subtle curved background overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/70 via-transparent to-emerald-900/60 pointer-events-none" />

          <div className="relative z-10">
            {/* Heading */}
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Simple Operational Workflow
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/90 font-medium">
                From document upload to verified digital record in just a few steps.
              </p>
            </div>

            {/* 4 Steps Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 items-center">

              {/* Step 1 */}
              <div className="flex flex-col items-center text-center space-y-2.5 relative">
                <div className="w-12 h-12 rounded-full bg-white text-[#0e6b38] flex items-center justify-center shadow-md">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-emerald-300">01</div>
                <div className="font-bold text-sm text-white">Upload Document</div>
                <div className="text-[11px] text-emerald-200/80">(Prescription / Telecom)</div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center space-y-2.5 relative">
                <div className="w-12 h-12 rounded-full bg-white text-[#0e6b38] flex items-center justify-center shadow-md">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-emerald-300">02</div>
                <div className="font-bold text-sm text-white">Data Entry</div>
                <div className="text-[11px] text-emerald-200/80">(Structured &amp; Validated)</div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center space-y-2.5 relative">
                <div className="w-12 h-12 rounded-full bg-white text-[#0e6b38] flex items-center justify-center shadow-md">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-emerald-300">03</div>
                <div className="font-bold text-sm text-white">Quality Check</div>
                <div className="text-[11px] text-emerald-200/80">(Auto + Manual QA)</div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center space-y-2.5 relative">
                <div className="w-12 h-12 rounded-full bg-white text-[#0e6b38] flex items-center justify-center shadow-md">
                  <Database className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-emerald-300">04</div>
                <div className="font-bold text-sm text-white">Verified Records</div>
                <div className="text-[11px] text-emerald-200/80">(Secure &amp; Reported)</div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. READY TO START DIGITIZATION (PRE-FOOTER CTA)           */}
      {/* ========================================================= */}
      <section className="py-4 sm:py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 hover:shadow-md transition-shadow">

          {/* Left: Friendly Operator Avatar + Text */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full md:w-auto text-center sm:text-left">


            <div className="space-y-1">
              <h3 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight">
                Ready to Start Digitization?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md">
                Join Abdiva&rsquo;s secure platform and manage high-volume medical and telecom records with speed, accuracy and complete control.
              </p>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto shrink-0 justify-end">
            <button
              type="button"
              onClick={handlePortalRedirect}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#0e6b38] hover:bg-[#0b542c] text-white px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <span>Login to Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate("/register")}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Register Operator
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. FOOTER                                                 */}
      {/* ========================================================= */}
      <footer id="security" className="mt-auto bg-[#F9FFFC] text-slate-800 py-6 text-xs border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">

          {/* Left Brand */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <img
              src={logoImg}
              alt="Abdiva Infotech"
              className="h-10 sm:h-12 w-auto object-contain"
            />
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="text-slate-600 font-medium">
              Enterprise Data Operations Platform
            </span>
          </div>



          {/* Right Copyright */}
          <div className="text-slate-600 font-medium text-[11px] sm:text-xs">
            &copy; {new Date().getFullYear()} Abdiva Infotech Pvt Ltd. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
