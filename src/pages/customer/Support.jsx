// src\pages\Support.jsx
import { useState, useEffect } from "react";

export default function Support() {
  const [animate, setAnimate] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setAnimate(true);
    // Update minute tick for the clock display
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Time Logic
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  // Closed if > 6:30 PM (18:30) or < 8:00 AM
  const isClosed = hours > 18 || (hours === 18 && minutes >= 30) || hours < 8;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 pb-32">
      {/* 1. Navbar / Top Area */}
      <div className="px-6 pt-12 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Support
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            We're here to help you.
          </p>
        </div>
        {/* Agent Facepile */}
        <div className="flex items-center -space-x-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#FAFAFA] bg-slate-200 overflow-hidden">
            <img src="https://i.pravatar.cc/100?img=33" alt="Agent" />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-[#FAFAFA] bg-slate-200 overflow-hidden">
            <img src="https://i.pravatar.cc/100?img=47" alt="Agent" />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-[#FAFAFA] bg-green-500 text-white flex items-center justify-center text-xs font-bold">
            <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <div
        className={`px-6 space-y-6 transition-all duration-700 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* 2. Search Bar (Self Service Focus) */}
        <div className="relative group">
          <div className="absolute inset-0 bg-blue-500/5 rounded-2xl blur-xl group-hover:bg-blue-500/10 transition-colors"></div>
          <div className="relative bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center p-4 transition-all focus-within:ring-2 focus-within:ring-slate-900/5">
            <svg
              className="w-6 h-6 text-slate-400 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search for answers (e.g. 'Repayment')"
              className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-400 font-medium"
            />
          </div>
        </div>

        {/* 3. The "Bento" Contact Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Main Card: WhatsApp (Occupies full width on mobile if you want, or large spot) */}
          <a
            href={`https://wa.me/${"+254762634893".replace(
              /\D/g,
              ""
            )}?text=Hello`}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 bg-[#25D366] hover:bg-[#22bf5b] rounded-[2rem] p-6 text-white shadow-lg shadow-green-500/20 transition-transform active:scale-[0.98] flex items-center justify-between relative overflow-hidden"
          >
            <div className="relative z-10 text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                  Fastest
                </span>
              </div>
              <h3 className="text-xl font-bold">WhatsApp Chat</h3>
              <p className="text-white/80 text-sm mt-1">
                Start a conversation now
              </p>
            </div>
            <svg
              className="w-16 h-16 text-white/20 absolute -right-2 -bottom-2 rotate-12"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </a>

          {/* Email Card */}
          <a
            href={`mailto:${"moderation.mails.go@gmail.com"}`}
            className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 flex flex-col items-start justify-between h-40 hover:border-slate-300 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="text-left">
              <h4 className="font-bold text-slate-800">Email Us</h4>
              <p className="text-xs text-slate-400 mt-1">
                For documents & inquiries
              </p>
            </div>
          </a>

          {/* Call Card - Adapts to time */}
          <button
            disabled={isClosed}
            className={`
                    rounded-[2rem] p-5 shadow-sm border flex flex-col items-start justify-between h-40 transition-colors
                    ${
                      isClosed
                        ? "bg-slate-100 border-slate-200 text-slate-400"
                        : "bg-white border-slate-100 text-slate-800 hover:border-slate-300"
                    }
                `}
          >
            <div className="flex justify-between w-full">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isClosed ? "bg-slate-200" : "bg-slate-900 text-white"
                }`}
              >
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              {isClosed && (
                <div className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded-md uppercase">
                  Closed
                </div>
              )}
            </div>
            <div className="text-left">
              <h4 className="font-bold">Call Center</h4>
              <p className="text-xs opacity-70 mt-1">
                {isClosed ? `Opens 8:00 AM` : "Available Now"}
              </p>
            </div>
          </button>
        </div>

        {/* 4. Quick Help Topics (Pill Grid) */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3">
            Common Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Repayment Failed",
              "Change Pin",
              "Increase Limit",
              "Loan Status",
              "Referrals",
            ].map((topic) => (
              <button
                key={topic}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Clean FAQ Accordion */}
        <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Top Questions</h3>
          </div>
          {[
            "How long does disbursement take?",
            "Can I pay via M-Pesa Express?",
            "What are the interest rates?",
          ].map((q, i) => (
            <div
              key={i}
              className="group p-4 border-b border-slate-100 last:border-0 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">
                {q}
              </span>
              <svg
                className="w-4 h-4 text-slate-300 group-hover:text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          ))}
          <div className="p-4 text-center">
            <button className="text-sm font-bold text-blue-600 hover:underline">
              View Help Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
