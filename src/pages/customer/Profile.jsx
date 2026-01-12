// src\pages\Profile.jsx
import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();
  const [user, setUser] = useState(null);
  const [animate, setAnimate] = useState(false);

  // App Preferences State
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    // Simulate loading data
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        name: currentUser.displayName || "Alex Kariuki",
        email: currentUser.email,
        photoURL: currentUser.photoURL,
        phone: currentUser.phoneNumber || "+254 712 345 678",
        verified: currentUser.emailVerified,
        uid: currentUser.uid,
        memberSince: "Jan 2026",
      });
    }
    setAnimate(true);
  }, []);

  const logout = async () => {
    try {
      await authLogout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Reusable Sleek Toggle Component
  const Toggle = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
        enabled ? "bg-accent" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-300 ease-in-out ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-28">
      {/* 1. Minimal Header */}
      <div className="pt-12 px-6 flex justify-between items-center bg-[#F3F4F6]">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          Account
        </h1>
        <button className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
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
              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
            />
          </svg>
        </button>
      </div>

      <div
        className={`px-6 mt-6 space-y-6 transition-all duration-700 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* 2. Premium Identity Card */}
        <div className="relative w-full aspect-[2/1] bg-gradient-to-br from-slate-900 via-primary to-slate-800 rounded-[2rem] p-6 shadow-2xl shadow-slate-900/20 overflow-hidden text-white border border-slate-700/50">
          {/* Abstract Gloss Effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative h-full flex flex-col justify-between z-10">
            <div className="flex justify-between items-start">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-700 border-2 border-white/10 overflow-hidden shadow-inner">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-400 bg-slate-800">
                      {user?.name?.charAt(0) || "A"}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-wide">
                    {user?.name}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {user?.uid?.substring(0, 10).toUpperCase() || "USER-8932"}
                  </p>
                </div>
              </div>

              {/* Verification Badge */}
              {user?.verified ? (
                <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-2.5 py-1 rounded-full border border-green-500/20">
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Verified
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-400 px-2.5 py-1 rounded-full border border-yellow-500/20 text-[10px] font-bold uppercase tracking-wider">
                  Pending
                </div>
              )}
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">
                  Contact
                </p>
                <p className="text-sm font-medium">{user?.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">
                  Member Since
                </p>
                <p className="text-sm font-medium">{user?.memberSince}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Smart Action Prompt */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                Unlock higher limits
              </p>
              <p className="text-xs text-slate-400">Add emergency contact</p>
            </div>
          </div>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-transform">
            Complete
          </button>
        </div>

        {/* 4. Grouped Settings UI */}
        <div className="space-y-6">
          {/* Section: Preferences */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-4 mb-2 block">
              Preferences
            </span>
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 divide-y divide-slate-50">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
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
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    Push Notifications
                  </span>
                </div>
                <Toggle
                  enabled={notificationsEnabled}
                  onChange={setNotificationsEnabled}
                />
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
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
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    Dark Mode
                  </span>
                </div>
                <Toggle enabled={darkTheme} onChange={setDarkTheme} />
              </div>
            </div>
          </div>

          {/* Section: Security */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-4 mb-2 block">
              Security
            </span>
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 divide-y divide-slate-50">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
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
                        d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.131A8 8 0 008 8m0 0a8 8 0 00-8 8c0 2.472.345 4.865.99 7.131M10 11a2 2 0 114 0 2 2 0 01-4 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    Biometric Login
                  </span>
                </div>
                <Toggle
                  enabled={biometricsEnabled}
                  onChange={setBiometricsEnabled}
                />
              </div>

              <button className="w-full flex items-center justify-between p-4 active:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
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
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    Change PIN / Password
                  </span>
                </div>
                <svg
                  className="w-4 h-4 text-slate-300"
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
              </button>
            </div>
          </div>
        </div>

        {/* 5. Minimal Logout */}
        <button
          onClick={logout}
          className="w-full py-4 text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-[1.5rem] transition-colors active:scale-95"
        >
          Sign Out of Account
        </button>

        {/* Footer App Info */}
        <div className="flex flex-col items-center justify-center text-xs text-slate-400 py-6">
          <p className="font-semibold text-slate-500 mb-1">
            Company App v1.2.0
          </p>
          <div className="flex gap-4">
            <span className="underline cursor-pointer">Terms</span>
            <span className="underline cursor-pointer">Privacy</span>
            <span className="underline cursor-pointer">Licenses</span>
          </div>
        </div>
      </div>
    </div>
  );
}
