// src\pages\Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [animate, setAnimate] = useState(false);

  // ---------------------------------------------------------
  // CONFIGURATION: TOGGLE THIS TO SEE DIFFERENT STATES
  // ---------------------------------------------------------
  const hasActiveApplication = true; // Set to false to see the "Eligible" state

  const user = {
    firstName: "Kevin",
    limit: 50000,
    balance: 0,
    creditScore: 720,
  };

  const applicationData = {
    id: "#APP-8921",
    type: "Business Loan",
    amount: 20000,
    status: "Under Review",
    date: "Today, 10:42 AM",
    step: 2, // 1: Received, 2: Review, 3: Finalizing
  };

  useEffect(() => {
    setAnimate(true);
  }, []);

  // Time based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-28">
      {/* 1. TOP HEADER & STORIES */}
      <div className="bg-white pb-6 pt-4 rounded-b-[2rem] shadow-sm relative z-20">
        {/* Header Row */}
        <div className="px-6 flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-lg">
              🤠
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                {getGreeting()}
              </p>
              <h1 className="text-xl font-bold text-slate-800">
                {user.firstName}
              </h1>
            </div>
          </div>

          <button className="p-2 bg-slate-50 rounded-full relative hover:bg-slate-100 transition-colors">
            <svg
              className="w-6 h-6 text-slate-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>

        {/* Stories / Insights Scroll */}
        <div className="flex gap-4 overflow-x-auto px-6 pb-2 scrollbar-hide">
          {/* Credit Score Pill */}
          <div className="flex-shrink-0 flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-2 rounded-full">
            <div className="w-6 h-6 relative">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="text-accent"
                  strokeDasharray="75, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                Credit Score
              </span>
              <span className="text-xs font-bold text-slate-700">
                {user.creditScore} (Good)
              </span>
            </div>
          </div>

          {/* Tip Pill */}
          <div className="flex-shrink-0 flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-2 rounded-full">
            <span className="text-lg">💡</span>
            <span className="text-xs font-bold text-blue-700">
              Pay early to increase limit
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-0 space-y-6 pt-6">
        {/* 2. MAIN LIMIT CARD (Dark Mode Contrast) */}
        <div
          className={`
            relative bg-[#0F172A] rounded-[2rem] p-6 text-white shadow-xl shadow-slate-300
            transform transition-all duration-700 ease-out ${
              animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }
        `}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">
                Total Loan Limit
              </p>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold tracking-tight">
                  {showBalance
                    ? `KSH ${user.limit.toLocaleString()}`
                    : "••••••••"}
                </h2>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  {showBalance ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.791 3.59M21 21l-3.59-3.59"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
              <svg
                className="w-5 h-5 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/app/apply")}
              className="flex-1 bg-accent hover:bg-green-500 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-green-900/20"
            >
              Apply Now
            </button>
            <button className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-sm transition-colors backdrop-blur-md">
              Top Up
            </button>
          </div>
        </div>

        {/* 3. CONDITIONAL SECTION */}
        <div
          className={`transition-all duration-700 delay-100 ${
            animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-slate-800 font-bold text-lg">
              {hasActiveApplication ? "Current Application" : "Explore"}
            </h3>
            {hasActiveApplication && (
              <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded">
                Live Updates
              </span>
            )}
          </div>

          {hasActiveApplication ? (
            /* --- APPLICATION TRACKER CARD --- */
            <div className="bg-white rounded-[1.5rem] p-1 shadow-sm border border-slate-100">
              <div className="p-5">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">
                        {applicationData.type}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {applicationData.id} • {applicationData.date}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-800">
                    KSH {applicationData.amount.toLocaleString()}
                  </span>
                </div>

                {/* Modern Progress Bar */}
                <div className="relative pt-2 pb-6">
                  <div className="flex justify-between items-center relative z-10">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-white">
                        ✓
                      </div>
                      <span className="absolute top-8 text-[10px] font-bold text-slate-800">
                        Sent
                      </span>
                    </div>
                    {/* Step 2 (Active) */}
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-white border-4 border-yellow-500 shadow-md flex items-center justify-center ring-4 ring-white relative">
                        <span className="absolute w-2 h-2 bg-yellow-500 rounded-full animate-ping opacity-75"></span>
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      </div>
                      <span className="absolute top-8 text-[10px] font-bold text-slate-800 whitespace-nowrap">
                        Reviewing
                      </span>
                    </div>
                    {/* Step 3 */}
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-slate-200 ring-4 ring-white"></div>
                      <span className="absolute top-8 text-[10px] font-bold text-slate-300">
                        Decision
                      </span>
                    </div>
                  </div>
                  {/* Line */}
                  <div className="absolute top-[1.2rem] left-0 w-full h-1 bg-slate-100 -z-0 rounded-full">
                    <div className="w-1/2 h-full bg-gradient-to-r from-accent to-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-b-[1.3rem] p-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">
                  We are checking your documents.
                </p>
                <button
                  onClick={() => navigate("/app/support")}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Contact Support
                </button>
              </div>
            </div>
          ) : (
            /* --- ALTERNATIVE: FEATURE GRID --- */
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => navigate("/app/loans")}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 active:scale-95 transition-transform"
              >
                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-800 text-sm">
                  Loan History
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  Check past repayments
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 active:scale-95 transition-transform">
                <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-3">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Schedule</h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  Next due dates
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 4. RECENT ACTIVITY PREVIEW */}
        <div
          className={`bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100 transition-all duration-700 delay-200 ${
            animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h3 className="text-slate-800 font-bold text-sm mb-4">
            Recent Activity
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">
                    Loan Disbursed
                  </p>
                  <p className="text-xs text-slate-400">12 Jan 2026</p>
                </div>
              </div>
              <span className="text-sm font-bold text-green-600">
                + KSH 15,000
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">Repayment</p>
                  <p className="text-xs text-slate-400">01 Jan 2026</p>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-800">
                - KSH 5,200
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
