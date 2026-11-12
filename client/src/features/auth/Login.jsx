import React, { useState } from "react";
import leftPanelImg from "../../assets/left-panel.png";
import { User, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { API_BASE_URL } from "../../config/api";

export default function Login({ onNavigateToRegister, onLoginSuccess, onNavigateHome }) {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrorMsg("");
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: formData.usernameOrEmail,
          password: formData.password,
        }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        // Response was not JSON
      }

      if (!response.ok) {
        throw new Error(data.message || `Login failed (${response.status}). Please check your credentials.`);
      }

      // Store auth session
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      if (data.user) {
        localStorage.setItem("authUser", JSON.stringify(data.user));
        sessionStorage.setItem("userId", data.user.id);
        // Start fresh operator session timer on login
        localStorage.setItem("operator_session_start_time", String(Date.now()));
        localStorage.setItem("operator_session_is_paused", "false");
        localStorage.removeItem("operator_session_paused_time");
        localStorage.setItem("operator_session_accumulated_paused_ms", "0");
      }

      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to communicate with server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 sm:p-6 lg:p-8 bg-gradient-to-br from-[#c8e6d0] via-[#c2ebdb] to-[#b6dec9]">
      {/* Main Card Container */}
      <div className="bg-white rounded-none sm:rounded-[36px] shadow-none sm:shadow-[0_20px_60px_-15px_rgba(20,80,50,0.18)] overflow-hidden flex flex-col md:flex-row w-full sm:max-w-[940px] border-0 sm:border border-white/60 min-h-screen sm:min-h-fit">
        {/* Left Branded Section */}
        <div className="w-full md:w-[49%] relative bg-[#266e51] flex flex-col justify-between overflow-hidden aspect-[455/458] sm:aspect-auto md:min-h-[460px]">
          <img
            src={leftPanelImg}
            alt="Abdiva Infotech - Partner for Data Entry Services"
            className="w-full h-full object-cover object-top select-none pointer-events-none"
          />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-[51%] bg-white px-6 py-8 sm:px-12 sm:py-14 flex flex-col justify-center flex-1">
          <div className="w-full max-w-sm mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-[32px] font-bold text-gray-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs  sm:text-xs m text-gray-500 mt-2 font-normal">
                SignIn to your Abdiva Infotech account
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs  text-red-700 animate-fade-in leading-relaxed">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username or Email Address Input */}
              <div className="group relative rounded-xl transition-all duration-300 ease-out focus-within:-translate-y-0.5">
                <div className="absolute -inset-[1.5px] rounded-xl bg-gradient-to-r from-[#118848] via-[#34d399] to-[#118848] opacity-0 group-focus-within:opacity-100 blur-[2px] transition-all duration-300 pointer-events-none" />

                <div className="relative flex items-center bg-white rounded-xl border border-gray-200 group-hover:border-gray-300 group-focus-within:border-transparent group-focus-within:shadow-[0_8px_20px_-4px_rgba(17,136,72,0.22)] transition-all duration-300">
                  <div className="pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#118848] group-focus-within:scale-110 transition-all duration-300 ease-out">
                    <User className="w-5 h-5 transition-transform duration-300" />
                  </div>
                  <input
                    type="text"
                    name="usernameOrEmail"
                    value={formData.usernameOrEmail}
                    onChange={handleChange}
                    placeholder="Username or Email Address"
                    required
                    className="w-full pl-3 pr-4 py-3 sm:py-3.5 bg-transparent rounded-xl text-gray-800 placeholder-gray-400 text-[16px] sm:text-xs m focus:outline-none transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="group relative rounded-xl transition-all duration-300 ease-out focus-within:-translate-y-0.5">
                <div className="absolute -inset-[1.5px] rounded-xl bg-gradient-to-r from-[#118848] via-[#34d399] to-[#118848] opacity-0 group-focus-within:opacity-100 blur-[2px] transition-all duration-300 pointer-events-none" />

                <div className="relative flex items-center bg-white rounded-xl border border-gray-200 group-hover:border-gray-300 group-focus-within:border-transparent group-focus-within:shadow-[0_8px_20px_-4px_rgba(17,136,72,0.22)] transition-all duration-300">
                  <div className="pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#118848] group-focus-within:scale-110 transition-all duration-300 ease-out">
                    <Lock className="w-5 h-5 transition-transform duration-300" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className="w-full pl-3 pr-10 py-3 sm:py-3.5 bg-transparent rounded-xl text-gray-800 placeholder-gray-400 text-[16px] sm:text-xs m focus:outline-none transition-colors duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 transition-colors duration-200" />
                    ) : (
                      <Eye className="w-5 h-5 transition-colors duration-200" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#118848] hover:bg-[#0e743d] active:scale-[0.98] text-white font-medium py-3 sm:py-3.5 px-4 rounded-xl shadow-[0_4px_14px_rgba(17,136,72,0.28)] hover:shadow-[0_8px_20px_rgba(17,136,72,0.38)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-xs m sm:text-base flex items-center justify-center cursor-pointer disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>

            {/* Don't have an account? Sign Up */}
            <div className="mt-8 text-center space-y-2">
              <p className="text-xs sm:text-xs text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={onNavigateToRegister}
                  className="font-semibold text-[#118848] hover:text-[#0e743d] hover:underline cursor-pointer transition-colors"
                >
                  Create an account
                </button>
              </p>

              {onNavigateHome && (
                <p className="pt-2">
                  <button
                    type="button"
                    onClick={onNavigateHome}
                    className="text-xs text-slate-400 hover:text-slate-700 hover:underline cursor-pointer transition-colors"
                  >
                    ← Back to Homepage
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
