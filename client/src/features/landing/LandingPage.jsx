import React, { useState } from "react";
import logoImg from "../../assets/logo.png";
import heroImg from "../../assets/hero.png";
import streamMedicalImg from "../../assets/stream-medical.png";
import streamTelecomImg from "../../assets/stream-telecom.png";
import AboutCompanySection from "./AboutCompanySection";
import AboutBpoSection from "./AboutBpoSection";

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
  Handshake,
  Play,
  Network,
  Headphones,
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

      <header className="sticky top-0 z-50 relative w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs">
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

          </div>

          {/* Center Links (Desktop >= lg) */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium text-slate-600">
            <a
              href="#home"
              className="text-[#0e6b38] font-bold relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:h-0.5 after:bg-[#0e6b38] after:rounded-full"
            >
              Home
            </a>
            <a href="#about" className="hover:text-[#0e6b38] transition-colors">
              About Us
            </a>
            <div className="flex items-center gap-1 hover:text-[#0e6b38] transition-colors cursor-pointer group">
              <a href="#solutions">Solutions</a>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0e6b38] transition-colors" />
            </div>
            <a href="#features" className="hover:text-[#0e6b38] transition-colors">
              Features
            </a>
            <a href="#workflow" className="hover:text-[#0e6b38] transition-colors">
              Workflow
            </a>
            <a href="#security" className="hover:text-[#0e6b38] transition-colors">
              Security
            </a>
          </nav>

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

        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 top-16 sm:top-18 bg-black/25 backdrop-blur-[2px] z-40 sm:hidden animate-in fade-in duration-200"
              onClick={closeMobileMenu}
            />

            <div className="sm:hidden absolute top-full left-0 right-0 w-full z-50 border-b border-slate-200/90 bg-white/98 backdrop-blur-md px-4 py-4 space-y-4 shadow-xl max-h-[calc(100vh-4.5rem)] overflow-y-auto animate-in slide-in-from-top-2 duration-200">

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
                  href="#about"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-[#0e6b38] transition-colors"
                >
                  <span>About Us (BPO Services)</span>
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
          </>
        )}
      </header>

      {/* ========================================================= */}
      {/* 2. HERO SECTION                                           */}
      {/* ========================================================= */}
      <section
        id="home"
        className="relative w-full overflow-hidden bg-cover bg-no-repeat bg-[position:85%_center] sm:bg-[position:right_center] lg:bg-right pt-8 sm:pt-14 pb-16 sm:pb-24 min-h-[500px] sm:min-h-[560px] lg:min-h-[620px] flex items-center"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="max-w-xl lg:max-w-xl xl:max-w-2xl space-y-4 sm:space-y-5 text-left">

            {/* Freelance BPO Pill Badge */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-300 text-xs sm:text-sm font-semibold text-[#0e6b38] shadow-2xs">
              Freelance BPO &amp; Data Entry Services
            </div>

            {/* Red Line Circled Area: Heading & Subtitle with Circular White Smoky Shadow */}
            <div className="relative inline-block w-full max-w-xl py-1">
              {/* Circular / Elliptical White Smoky Shadow ONLY in this circled area */}
              <div
                className="absolute -inset-4 sm:-inset-6 -z-10 rounded-[50px] sm:rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 92% 85% at 42% 48%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.92) 50%, rgba(255, 255, 255, 0.40) 75%, rgba(255, 255, 255, 0) 100%)",
                  filter: "blur(16px)",
                }}
              />

              {/* Hero Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px] font-black tracking-tight text-slate-900 leading-[1.12]">
                Looking for <br />
                Reliable Data Entry <br />
                <span className="text-[#0e6b38]">&amp; Back Office Support?</span>
              </h1>

              {/* Subtitle Description */}
              <p className="mt-3.5 sm:mt-4 text-sm sm:text-base text-slate-700 leading-relaxed font-normal max-w-lg">
                Grow your business with a trusted freelance team for Data Processing, Document Management, Form Filling, and customized BPO solutions.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (isLoggedIn) handlePortalRedirect();
                  else onNavigate("/login");
                }}
                className="inline-flex items-center justify-center gap-2 bg-[#0e6b38] hover:bg-[#0b542c] text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-[0.98]"
              >
                <span>Hire Freelancer</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#bpo-support"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base shadow-xs hover:border-slate-300 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-[#0e6b38] text-[#0e6b38]" />
                <span>View Services</span>
              </a>
            </div>

            {/* 4 Feature Checkmark Pills (Bottom Row) */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-3 text-xs sm:text-[13px] font-medium text-slate-700">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200/90 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-[#0e6b38] shrink-0" />
                <span>Accurate &amp; On-Time</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200/90 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-[#0e6b38] shrink-0" />
                <span>Cost-Effective</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200/90 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-[#0e6b38] shrink-0" />
                <span>Flexible Engagement</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200/90 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-[#0e6b38] shrink-0" />
                <span>Confidential &amp; Secure</span>
              </span>
            </div>

          </div>
        </div>

        {/* Bottom Wave Divider */}
        <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10">
          <svg
            viewBox="0 0 1440 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-8 sm:h-12 lg:h-14 text-white"
            preserveAspectRatio="none"
          >
            <path
              d="M0,32 C320,64 640,16 960,48 C1200,64 1360,24 1440,32 L1440,64 L0,64 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* Floating 4-Metric Stats Bar (matching user reference image) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 lg:-mt-12 relative z-20">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-slate-100/90 px-6 sm:px-8 lg:px-10 py-3.5 sm:py-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-center">
            {/* 1. 10+ Years Experience */}
            <div className="flex items-center gap-3">
              <Network className="w-6 h-6 sm:w-7 sm:h-7 text-[#0e6b38] shrink-0 stroke-[2.2]" />
              <div className="text-left">
                <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">10+ Years</div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight">Experience</div>
              </div>
            </div>

            {/* 2. 100+ Skilled Professionals */}
            <div className="flex items-center gap-3 lg:border-l lg:border-slate-200/80 lg:pl-6">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-[#0e6b38] shrink-0 stroke-[2.2]" />
              <div className="text-left">
                <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">100+</div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight">Skilled Professionals</div>
              </div>
            </div>

            {/* 3. 500+ Projects Delivered */}
            <div className="flex items-center gap-3 lg:border-l lg:border-slate-200/80 lg:pl-6">
              <Layers className="w-6 h-6 sm:w-7 sm:h-7 text-[#0e6b38] shrink-0 stroke-[2.2]" />
              <div className="text-left">
                <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">500+</div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight">Projects Delivered</div>
              </div>
            </div>

            {/* 4. 24/7 Operational Support */}
            <div className="flex items-center gap-3 lg:border-l lg:border-slate-200/80 lg:pl-6">
              <Headphones className="w-6 h-6 sm:w-7 sm:h-7 text-[#0e6b38] shrink-0 stroke-[2.2]" />
              <div className="text-left">
                <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">24/7</div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight">Operational Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AboutCompanySection />
      <AboutBpoSection />
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">

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



      <section id="features" className="py-10 sm:py-14 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

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
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">

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

      <section id="workflow" className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-[#093d22] text-white py-10 sm:py-14 px-5 sm:px-10 rounded-[28px] sm:rounded-[36px] shadow-lg relative overflow-hidden">

          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/70 via-transparent to-emerald-900/60 pointer-events-none" />

          <div className="relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Simple Operational Workflow
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/90 font-medium">
                From document upload to verified digital record in just a few steps.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 items-center">

              <div className="flex flex-col items-center text-center space-y-2.5 relative">
                <div className="w-12 h-12 rounded-full bg-white text-[#0e6b38] flex items-center justify-center shadow-md">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-emerald-300">01</div>
                <div className="font-bold text-sm text-white">Upload Document</div>
                <div className="text-[11px] text-emerald-200/80">(Prescription / Telecom)</div>
              </div>

              <div className="flex flex-col items-center text-center space-y-2.5 relative">
                <div className="w-12 h-12 rounded-full bg-white text-[#0e6b38] flex items-center justify-center shadow-md">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-emerald-300">02</div>
                <div className="font-bold text-sm text-white">Data Entry</div>
                <div className="text-[11px] text-emerald-200/80">(Structured &amp; Validated)</div>
              </div>

              <div className="flex flex-col items-center text-center space-y-2.5 relative">
                <div className="w-12 h-12 rounded-full bg-white text-[#0e6b38] flex items-center justify-center shadow-md">
                  <CheckSquare className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-emerald-300">03</div>
                <div className="font-bold text-sm text-white">Quality Check</div>
                <div className="text-[11px] text-emerald-200/80">(Auto + Manual QA)</div>
              </div>

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

      <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gradient-to-r from-[#07361a] via-[#0e6b38] to-[#084020] rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:px-8 lg:py-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 border border-emerald-600/40 relative overflow-hidden group">

          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/10 pointer-events-none" />

          <div className="flex items-center gap-3.5 sm:gap-4 w-full md:w-auto relative z-10 text-left">
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Handshake className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[1.8]" />
            </div>

            <div className="space-y-0.5">
              <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-white tracking-tight leading-snug">
                Hire a Freelance BPO Team Today!
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium tracking-wide flex items-center gap-2 flex-wrap">
                <span>Reliable</span>
                <span className="text-emerald-300/60 font-light">|</span>
                <span>Affordable</span>
                <span className="text-emerald-300/60 font-light">|</span>
                <span>Professional</span>
              </p>
            </div>
          </div>

          <div className="hidden md:block h-9 w-[1.5px] bg-white/30 relative z-10" />

          <div className="w-full md:w-auto flex items-center justify-end relative z-10 shrink-0">
            <button
              type="button"
              onClick={() => (onNavigate ? onNavigate("/register") : handlePortalRedirect())}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <span>Get a Free Quote</span>
              <ArrowRight className="w-4 h-4 text-slate-900" />
            </button>
          </div>

        </div>
      </section>

      <footer id="security" className="mt-auto bg-[#F9FFFC] text-slate-800 py-6 text-xs border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">

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


          <div className="text-slate-600 font-medium text-[11px] sm:text-xs">
            &copy; {new Date().getFullYear()} Abdiva Infotech Pvt Ltd. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
