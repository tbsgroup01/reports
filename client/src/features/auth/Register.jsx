import React, { useState } from "react";
import leftPanelImg from "../../assets/left-panel.png";
import { User, Mail, Check, AlertCircle, ArrowRight } from "lucide-react";

export default function Register({ onNavigateToLogin, onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
      const response = await fetch("http://localhost:3000/api/auth/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }

      setSubmitted(true);
      if (onRegisterSuccess) {
        onRegisterSuccess(data.data);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to connect to server.");
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
                Create Account
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 font-normal">
                Register as an Operator with Abdiva Infotech Pvt Ltd
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-6 text-center animate-fade-in">
                <div className="w-12 h-12 bg-emerald-100 text-[#118848] rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  Registration Successful!
                </h3>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  Welcome aboard,{" "}
                  <span className="font-semibold text-emerald-700">
                    {formData.fullName || "User"}
                  </span>
                  ! Your account has been registered. An administrator will assign your password
                  from the admin panel before you can log in.
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={onNavigateToLogin}
                    className="w-full bg-[#118848] hover:bg-[#0e743d] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Proceed to Login</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ fullName: "", email: "" });
                    }}
                    className="text-xs font-medium text-slate-500 hover:text-slate-800 hover:underline pt-1"
                  >
                    Register another user
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name Input */}
                <div className="group relative rounded-xl transition-all duration-300 ease-out focus-within:-translate-y-0.5">
                  <div className="absolute -inset-[1.5px] rounded-xl bg-gradient-to-r from-[#118848] via-[#34d399] to-[#118848] opacity-0 group-focus-within:opacity-100 blur-[2px] transition-all duration-300 pointer-events-none" />

                  <div className="relative flex items-center bg-white rounded-xl border border-gray-200 group-hover:border-gray-300 group-focus-within:border-transparent group-focus-within:shadow-[0_8px_20px_-4px_rgba(17,136,72,0.22)] transition-all duration-300">
                    <div className="pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#118848] group-focus-within:scale-110 transition-all duration-300 ease-out">
                      <User className="w-5 h-5 transition-transform duration-300" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Full Name"
                      required
                      className="w-full pl-3 pr-4 py-3 sm:py-3.5 bg-transparent rounded-xl text-gray-800 placeholder-gray-400 text-[16px] sm:text-sm focus:outline-none transition-colors duration-200"
                    />
                  </div>
                </div>

                {/* Email Address Input */}
                <div className="group relative rounded-xl transition-all duration-300 ease-out focus-within:-translate-y-0.5">
                  <div className="absolute -inset-[1.5px] rounded-xl bg-gradient-to-r from-[#118848] via-[#34d399] to-[#118848] opacity-0 group-focus-within:opacity-100 blur-[2px] transition-all duration-300 pointer-events-none" />

                  <div className="relative flex items-center bg-white rounded-xl border border-gray-200 group-hover:border-gray-300 group-focus-within:border-transparent group-focus-within:shadow-[0_8px_20px_-4px_rgba(17,136,72,0.22)] transition-all duration-300">
                    <div className="pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#118848] group-focus-within:scale-110 transition-all duration-300 ease-out">
                      <Mail className="w-5 h-5 transition-transform duration-300" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      required
                      className="w-full pl-3 pr-4 py-3 sm:py-3.5 bg-transparent rounded-xl text-gray-800 placeholder-gray-400 text-[16px] sm:text-sm focus:outline-none transition-colors duration-200"
                    />
                  </div>
                </div>

                {/* Sign Up Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#118848] hover:bg-[#0e743d] active:scale-[0.98] text-white font-medium py-3 sm:py-3.5 px-4 rounded-xl shadow-[0_4px_14px_rgba(17,136,72,0.28)] hover:shadow-[0_8px_20px_rgba(17,136,72,0.38)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-sm sm:text-base flex items-center justify-center cursor-pointer disabled:opacity-70 disabled:hover:translate-y-0"
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
                        Creating account...
                      </span>
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Already have an account? Login */}
            <div className="mt-8 text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="font-semibold text-[#118848] hover:text-[#0e743d] hover:underline cursor-pointer transition-colors"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
