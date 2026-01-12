// src\pages\Apply.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { WHATSAPP_NUMBER } from "../../config/support";

export default function Apply() {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  // Form State
  const [amount, setAmount] = useState(10000);
  const [duration, setDuration] = useState(30);
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [userLimit, setUserLimit] = useState(0);
  const [phone, setPhone] = useState("");
  const [missingPhone, setMissingPhone] = useState(false);

  // Constants
  // Minimum loan duration is 30 days
  const INTEREST_RATE = 0.2; // 20% as per requirements
  const PROCESSING_FEE_RATE = 0.0; // No processing fee required by spec

  // Calculations
  const interest = Math.round(amount * INTEREST_RATE * (duration / 30));
  const processingFee = Math.round(amount * PROCESSING_FEE_RATE);
  const totalRepayment = parseInt(amount) + interest + processingFee;

  useEffect(() => {
    setAnimate(true);

    // Load current user's limit and phone from Firestore
    const loadUser = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      const userRef = doc(db, "users", currentUser.uid);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        const limit = data.limit || 0;
        setUserLimit(limit);
        // Adjust default amount not to exceed user limit
        setAmount((prev) => (limit > 0 ? Math.min(prev, limit) : prev));
        setPhone(data.phone || "");
        if (!data.phone) setMissingPhone(true);
      }
    };

    loadUser();
  }, []);

  // Purpose Configuration with Specific Colors
  const purposes = [
    {
      id: "business",
      label: "Business",
      icon: "🚀",
      color: "bg-blue-500",
      light: "bg-blue-50 text-blue-600 border-blue-100",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      id: "emergency",
      label: "Emergency",
      icon: "🚑",
      color: "bg-red-500",
      light: "bg-red-50 text-red-600 border-red-100",
      gradient: "from-red-500 to-pink-600",
    },
    {
      id: "personal",
      label: "Personal",
      icon: "🏠",
      color: "bg-purple-500",
      light: "bg-purple-50 text-purple-600 border-purple-100",
      gradient: "from-purple-500 to-violet-600",
    },
    {
      id: "education",
      label: "Education",
      icon: "🎓",
      color: "bg-amber-500",
      light: "bg-amber-50 text-amber-600 border-amber-100",
      gradient: "from-amber-400 to-orange-500",
    },
  ];

  const activePurposeData = purposes.find((p) => p.id === purpose);

  const handleSubmit = async () => {
    if (!purpose) return;

    if (userLimit <= 0) {
      alert(
        "You don't have an assigned loan limit yet. Please contact admin to get a limit."
      );
      return;
    }

    if (amount > userLimit) {
      alert(
        `Requested amount exceeds your limit of KSH ${userLimit.toLocaleString()}`
      );
      return;
    }

    if (duration < 30) {
      alert("Minimum loan duration is 30 days.");
      return;
    }

    if (!phone) {
      setMissingPhone(true);
      alert("Please provide a mobile number to transact with before applying.");
      return;
    }

    setLoading(true);

    try {
      // Fetch the user's profile snapshot to store with the application
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      const applicantProfile = userSnap.exists() ? userSnap.data() : null;

      const loanRef = collection(db, "loans");
      const docRef = await addDoc(loanRef, {
        userId: auth.currentUser.uid,
        applicantName: auth.currentUser.displayName || null,
        applicantEmail: auth.currentUser.email || null,
        applicantProfile,
        amount: Number(amount),
        durationDays: Number(duration),
        purpose,
        status: "under_review",
        createdAt: serverTimestamp(),
        interest: interest,
        processingFee: processingFee,
        totalRepayment: totalRepayment,
        phoneUsed: phone,
      });

      // Prepare review message and send to WhatsApp for quick admin review
      try {
        const loanId = docRef.id;
        const reviewLink = `${window.location.origin}/admin/applications/${loanId}`;
        const message = `New loan application:%0A%0AName: ${auth.currentUser.displayName || 'N/A'}%0AEmail: ${auth.currentUser.email}%0AAmount: KSH ${amount}%0ADuration: ${duration} days%0APurpose: ${purpose}%0ATotal: KSH ${totalRepayment}%0APhone: ${phone}%0AApplication ID: ${loanId}%0AReview: ${reviewLink}`;
        const number = WHATSAPP_NUMBER.replace(/\D/g, "");
        const waUrl = `https://wa.me/${number}?text=${message}`;

        // Open WhatsApp Web / App in a new tab for immediate review
        window.open(waUrl, "_blank");

        // Persist review metadata to the loan doc
        await updateDoc(doc(db, "loans", docRef.id), {
          reviewSentToWhatsApp: true,
          reviewWhatsAppUrl: waUrl,
          reviewSentAt: serverTimestamp(),
          reviewTo: WHATSAPP_NUMBER,
        });
      } catch (waErr) {
        console.warn("WhatsApp notification failed", waErr);
      }

      // Inform user
      alert("Loan application submitted and sent for admin review.");
      navigate("/app/home");
    } catch (err) {
      console.error(err);
      alert("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      {/* 1. Dynamic Header */}
      <div
        className={`
        relative px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-xl overflow-hidden transition-all duration-500
        ${
          activePurposeData
            ? `bg-gradient-to-br ${activePurposeData.gradient}`
            : "bg-primary"
        }
      `}
      >
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div
          className={`relative z-10 transition-all duration-700 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Apply for Loan
              </h1>
              <p className="text-white/80 text-sm font-medium">
                Select amount & purpose
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              <span className="text-xs font-bold text-white">
                Limit: KSH {userLimit?.toLocaleString() || 0}
              </span>
            </div>
          </div>

          {/* Big Amount Display */}
          <div className="flex items-baseline justify-center gap-1 py-4">
            <span className="text-2xl font-medium text-white/80">KSH</span>
            <span className="text-5xl font-black text-white tracking-tighter">
              {amount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div
        className={`px-5 -mt-6 space-y-5 transition-all duration-700 delay-100 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* 2. Amount Slider Card */}
        <div className="bg-white rounded-[2rem] p-6 shadow-lg shadow-slate-200/50 border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Adjust Amount
            </label>
          </div>

          <input
            type="range"
            min="500"
            max={userLimit || 500}
            step="500"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className={`
                w-full h-4 rounded-full appearance-none cursor-pointer outline-none transition-all duration-500
                ${activePurposeData ? activePurposeData.color : "bg-primary"}
              `}
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.3) ${
                (amount / (userLimit || 500)) * 100
              }%, #e2e8f0 ${(amount / (userLimit || 500)) * 100}%)`,
            }}
          />
          <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400">
            <span>KSH 500</span>
            <span>{userLimit ? "Max Limit" : "No Limit assigned"}</span>
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400">
            <span>KSH 500</span>
            <span>Max Limit</span>
          </div>
        </div>

        {/* 3. Duration Selector (Colorful Pills) */}
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">
            Duration
          </label>
          <div className="flex justify-between gap-2">
            {[30, 60, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`
                            flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300
                            ${
                              duration === d
                                ? `${
                                    activePurposeData
                                      ? activePurposeData.color
                                      : "bg-slate-800"
                                  } text-white shadow-lg transform scale-105`
                                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                            }
                        `}
              >
                {d} Days
              </button>
            ))}
          </div>
        </div>

        {/* 4. Purpose Grid (The "Colorful Cards") */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3 pl-2">
            Loan Purpose
          </label>
          <div className="grid grid-cols-2 gap-3">
            {purposes.map((p) => (
              <button
                key={p.id}
                onClick={() => setPurpose(p.id)}
                className={`
                            relative overflow-hidden p-4 rounded-2xl border-2 text-left transition-all duration-300 group
                            ${
                              purpose === p.id
                                ? `${
                                    p.light
                                  } border-transparent ring-2 ring-offset-2 ring-${
                                    p.color.split("-")[1]
                                  }-400 shadow-md scale-[1.02]`
                                : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                            }
                        `}
              >
                <span className="text-2xl mb-2 block transform group-hover:scale-110 transition-transform duration-300">
                  {p.icon}
                </span>
                <span className="font-bold text-sm">{p.label}</span>

                {/* Selected Indicator */}
                {purpose === p.id && (
                  <div
                    className={`absolute top-3 right-3 w-4 h-4 rounded-full ${p.color} flex items-center justify-center`}
                  >
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Dark Summary Receipt */}
        <div className="bg-slate-900 rounded-[2rem] p-6 text-slate-300 shadow-xl shadow-slate-900/20 relative overflow-hidden">
          {/* Texture */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>

          <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Receipt
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-1 rounded text-slate-900 ${
                activePurposeData ? "bg-white" : "bg-slate-700 text-white"
              }`}
            >
              {duration} Days Term
            </span>
          </div>

          <div className="space-y-2 text-sm mb-6">
            <div className="flex justify-between">
              <span>Principal</span>
              <span className="text-white font-medium">
                {amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Interest</span>
              <span className="text-white font-medium">
                + {interest.toLocaleString()}
              </span>
            </div>
            {processingFee > 0 && (
              <div className="flex justify-between">
                <span>Processing Fee</span>
                <span className="text-white font-medium">
                  + {processingFee.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center">
            <span className="font-bold">Total Repayment</span>
            <span
              className={`text-xl font-bold ${
                activePurposeData ? "text-white" : "text-accent"
              }`}
            >
              KSH {totalRepayment.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Phone Input if missing */}
        {missingPhone && (
          <div className="bg-white rounded-[1rem] p-4 mb-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
              Mobile number to transact with
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +254712345678"
              className="w-full p-3 border rounded text-sm"
            />
            <p className="text-xs text-slate-400 mt-2">
              This number will be used to transact when your loan is approved —
              payments are manual.
            </p>
          </div>
        )}

        {/* Limit Notice */}
        {userLimit <= 0 && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded p-3 mb-3">
            You don't have an assigned loan limit yet. Contact an admin to set
            your limit.
          </div>
        )}

        {/* 6. Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!purpose || loading || userLimit <= 0 || amount > userLimit}
          className={`
            w-full py-4 rounded-2xl font-bold text-white shadow-xl text-lg
            transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3
            ${
              !purpose || loading || userLimit <= 0 || amount > userLimit
                ? "bg-slate-300 cursor-not-allowed shadow-none"
                : `bg-gradient-to-r ${
                    activePurposeData
                      ? activePurposeData.gradient
                      : "from-slate-800 to-black"
                  } hover:shadow-2xl`
            }
          `}
        >
          {loading ? (
            <>
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
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Get KSH {amount.toLocaleString()}</span>
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
