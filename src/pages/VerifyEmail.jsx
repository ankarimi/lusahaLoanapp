// src\pages\VerifyEmail.jsx
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { sendEmailVerification, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [adIndex, setAdIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  const userEmail = auth.currentUser?.email || "your email";

  // 1. "Ad Clip" Data - Rotating Feature Highlights
  const ads = [
    {
      id: 1,
      title: "Instant Approval",
      desc: "Get loans approved in under 5 minutes with our AI engine.",
      icon: "⚡",
      color: "bg-blue-500",
      bg: "bg-blue-50",
    },
    {
      id: 2,
      title: "Grow Your Limit",
      desc: "Repay on time to unlock limits up to KSH 50,000.",
      icon: "📈",
      color: "bg-green-500",
      bg: "bg-green-50",
    },
    {
      id: 3,
      title: "Low Interest Rates",
      desc: "Enjoy rates as low as 1.5% for loyal customers.",
      icon: "💎",
      color: "bg-purple-500",
      bg: "bg-purple-50",
    },
  ];

  // 2. Mount Animation & Auto-Check Interval
  useEffect(() => {
    setAnimate(true);

    // Auto-check verification status every 3 seconds
    const interval = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          navigate("/onboarding");
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate]);

  // 3. Ad Rotation Timer
  useEffect(() => {
    const adTimer = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % ads.length);
    }, 5000); // Rotate every 5 seconds
    return () => clearInterval(adTimer);
  }, []);

  // 4. Resend Timer Logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleManualCheck = async () => {
    setLoading(true);
    await auth.currentUser.reload();
    if (auth.currentUser.emailVerified) {
      navigate("/onboarding");
    } else {
      // Small vibration or shake effect could go here
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      await sendEmailVerification(auth.currentUser);
      setEmailSent(true);
      setTimeLeft(60); // 60 second cooldown
      setTimeout(() => setEmailSent(false), 3000);
    } catch (error) {
      console.error("Error resending email", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = async () => {
    await signOut(auth);
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div
        className={`relative z-10 w-full max-w-md space-y-8 transition-all duration-1000 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Main Card */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 p-8 text-center border border-slate-100 relative overflow-hidden">
          {/* Top Gloss */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-accent to-purple-500"></div>

          {/* Animated Icon */}
          <div className="mb-6 relative inline-block">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-4xl">
              📩
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
              <div className="w-5 h-5 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
            Check your Inbox
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            We sent a verification link to <br />
            <span className="font-bold text-slate-800">{userEmail}</span>
          </p>

          {/* Manual Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleManualCheck}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold shadow-lg shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "I verified it!"
              )}
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleResend}
                disabled={timeLeft > 0 || loading}
                className={`
                            flex-1 py-3 rounded-xl border font-semibold text-xs transition-colors
                            ${
                              timeLeft > 0
                                ? "bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                            }
                        `}
              >
                {timeLeft > 0 ? `Resend in ${timeLeft}s` : "Resend Email"}
              </button>

              <button
                onClick={handleChangeEmail}
                className="flex-1 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                Wrong Email?
              </button>
            </div>
          </div>

          {/* Resend Feedback Toast */}
          {emailSent && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-bounce">
              Email sent successfully!
            </div>
          )}
        </div>

        {/* FEATURE SPOTLIGHT "AD CLIP" */}
        <div className="relative h-28 w-full overflow-hidden">
          {ads.map((ad, index) => (
            <div
              key={ad.id}
              className={`
                        absolute inset-0 w-full h-full transition-all duration-700 ease-in-out transform
                        ${
                          index === adIndex
                            ? "translate-x-0 opacity-100 scale-100"
                            : index < adIndex
                            ? "-translate-x-full opacity-0 scale-95"
                            : "translate-x-full opacity-0 scale-95"
                        }
                    `}
            >
              <div
                className={`${ad.bg} border border-slate-100 p-5 rounded-2xl flex items-center gap-4 h-full shadow-sm`}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${ad.color} flex items-center justify-center text-2xl shadow-md text-white`}
                >
                  {ad.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-slate-800 text-sm">
                    {ad.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-tight">
                    {ad.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Carousel Indicators */}
          <div className="absolute bottom-2 left-0 w-full flex justify-center gap-1.5">
            {ads.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === adIndex ? "w-4 bg-slate-800" : "w-1.5 bg-slate-300"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
