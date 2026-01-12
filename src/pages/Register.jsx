// src\pages\Register.jsx
import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { createSession } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // UI State
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [adIndex, setAdIndex] = useState(0);

  // ---------------------------------------------------------------------------
  // ANIMATED AD CLIPS DATA
  // ---------------------------------------------------------------------------
  const adClips = [
    {
      title: "Limitless Potential",
      text: "Admins assign an initial limit; request a limit after registration and build trust to grow it.",
      icon: "🚀",
      bgGradient: "from-blue-600 to-indigo-900",
    },
    {
      title: "Zero Hidden Fees",
      text: "What you see is what you pay. Transparent interest rates from day one.",
      icon: "💎",
      bgGradient: "from-emerald-600 to-teal-900",
    },
    {
      title: "Instant Verification",
      text: "Our AI-powered engine verifies your identity in seconds, not days.",
      icon: "⚡",
      bgGradient: "from-purple-600 to-fuchsia-900",
    },
  ];

  useEffect(() => {
    setAnimate(true);
    // Rotate Ads every 5 seconds
    const interval = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % adClips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ---------------------------------------------------------------------------
  // LOGIC
  // ---------------------------------------------------------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveUserToDb = async (user, additionalData = {}) => {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        name: additionalData.name || user.displayName || "User",
        email: user.email,
        phone: additionalData.phone || user.phoneNumber || "",
        role: "customer",
        createdAt: Date.now(),
        authProvider: additionalData.provider || "email",
        limit: 0, // Default starting limit (admins assign limits manually)
        trustScore: 10,
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Ensure phone is provided since it's used for loan transactions
    if (!formData.phone || !formData.phone.trim()) {
      setError("Please provide a mobile phone number for transactions.");
      return;
    }

    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      await sendEmailVerification(cred.user);
      await saveUserToDb(cred.user, {
        name: formData.name,
        phone: formData.phone,
        provider: "email",
      });
      // Create session token
      createSession(cred.user);
      navigate("/verify-email");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use")
        setError("That email is already in use.");
      else if (err.code === "auth/weak-password")
        setError("Password is too weak.");
      else setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = async (providerName) => {
    setError("");
    setLoading(true);
    let provider =
      providerName === "google"
        ? new GoogleAuthProvider()
        : new GithubAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      await saveUserToDb(result.user, { provider: providerName });
      // Create session token
      createSession(result.user);
      navigate("/app/home");
    } catch (err) {
      console.error(err);
      setError(`Failed to continue with ${providerName}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometrics = async () => {
    // (Simplified visual trigger logic for UI purposes)
    setError("Passkey creation initiated on device...");
    setTimeout(() => setError(""), 3000);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 overflow-hidden">
      {/* ---------------------------------------------------------------------
          LEFT SIDE: THE LOUNGE (Animated Ad Clips)
          Hidden on mobile, visible on lg screens
      --------------------------------------------------------------------- */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 text-white items-center justify-center">
        {/* Dynamic Backgrounds based on Active Ad */}
        {adClips.map((ad, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-gradient-to-br ${
              ad.bgGradient
            } transition-opacity duration-1000 ease-in-out ${
              i === adIndex ? "opacity-100" : "opacity-0"
            }`}
          ></div>
        ))}

        {/* Abstract Shapes overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-white rounded-full blur-[150px] animate-pulse"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 p-12 max-w-lg text-center">
          {adClips.map((ad, i) => (
            <div
              key={i}
              className={`transition-all duration-700 absolute inset-0 flex flex-col items-center justify-center transform 
                ${
                  i === adIndex
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-10 scale-95 pointer-events-none"
                }`}
              style={{ position: i === adIndex ? "relative" : "absolute" }} // Fix layout stacking
            >
              <div className="w-24 h-24 bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center text-6xl mb-8 shadow-2xl border border-white/20">
                {ad.icon}
              </div>
              <h2 className="text-4xl font-bold mb-4 tracking-tight leading-tight">
                {ad.title}
              </h2>
              <p className="text-lg text-white/80 font-light leading-relaxed">
                {ad.text}
              </p>
            </div>
          ))}

          {/* Carousel Indicators */}
          <div className="flex gap-2 justify-center mt-12">
            {adClips.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === adIndex ? "w-8 bg-white" : "w-2 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          RIGHT SIDE: THE FORM (Modern Sleek)
      --------------------------------------------------------------------- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        {/* Mobile Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl lg:hidden pointer-events-none"></div>

        <div
          className={`w-full max-w-md transition-all duration-700 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Create Account
            </h1>
            <p className="text-slate-500">
              Join the future of personal finance.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Floating Label Input Group */}
            <div className="space-y-4">
              <div className="relative group">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder=" "
                  value={formData.name}
                  onChange={handleChange}
                  className="peer block w-full px-4 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder-transparent"
                />
                <label className="absolute left-4 top-4 text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-white peer-focus:px-1 pointer-events-none bg-transparent">
                  Full Name
                </label>
              </div>

              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder=" "
                  value={formData.email}
                  onChange={handleChange}
                  className="peer block w-full px-4 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder-transparent"
                />
                <label className="absolute left-4 top-4 text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-white peer-focus:px-1 pointer-events-none bg-transparent">
                  Email Address
                </label>
              </div>

              <div className="relative group">
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder=" "
                  value={formData.phone}
                  onChange={handleChange}
                  className="peer block w-full px-4 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder-transparent"
                />
                <label className="absolute left-4 top-4 text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-white peer-focus:px-1 pointer-events-none bg-transparent">
                  Phone Number
                </label>
              </div>

              <div className="relative group">
                <input
                  type="password"
                  name="password"
                  required
                  placeholder=" "
                  value={formData.password}
                  onChange={handleChange}
                  className="peer block w-full px-4 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder-transparent"
                />
                <label className="absolute left-4 top-4 text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-white peer-focus:px-1 pointer-events-none bg-transparent">
                  Password
                </label>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center animate-pulse">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
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
                <>
                  Get Started
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="relative py-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest text-slate-400 bg-slate-50 px-4">
              Instant Access
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleSocialRegister("google")}
              className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.36c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm font-semibold text-slate-600">
                Google
              </span>
            </button>
            <button
              onClick={handleBiometrics}
              className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
            >
              <svg
                className="w-5 h-5 text-slate-800"
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
              <span className="text-sm font-semibold text-slate-600">
                Passkey
              </span>
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already a member?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary font-bold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
