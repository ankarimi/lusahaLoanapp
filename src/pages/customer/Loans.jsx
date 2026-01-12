// src\pages\Loans.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Loans() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [animate, setAnimate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock Data
  const loans = [
    {
      id: "LN-8832",
      amount: 30000,
      balance: 12500,
      status: "ACTIVE",
      dueDate: "30 Mar 2026",
      issuedDate: "01 Mar 2026",
      type: "Personal Loan",
      interest: "12%",
    },
    {
      id: "LN-4421",
      amount: 15000,
      balance: 15000,
      status: "OVERDUE",
      dueDate: "15 Feb 2026",
      issuedDate: "15 Jan 2026",
      type: "Emergency Loan",
      interest: "15%",
    },
    {
      id: "LN-1029",
      amount: 5000,
      balance: 0,
      status: "PAID",
      dueDate: "10 Dec 2025",
      issuedDate: "01 Dec 2025",
      type: "Airtime Advance",
      interest: "5%",
    },
  ];

  // Calculations
  const totalDebt = loans
    .filter((l) => l.status !== "PAID")
    .reduce((acc, curr) => acc + curr.balance, 0);

  useEffect(() => {
    setAnimate(true);
  }, []);

  // Filter Logic
  const filteredLoans = loans.filter((loan) => {
    const matchesTab =
      activeTab === "active"
        ? loan.status === "ACTIVE" || loan.status === "OVERDUE"
        : loan.status === "PAID";

    const matchesSearch =
      loan.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28">
      {/* 1. Header & Portfolio Summary */}
      <div className="bg-white px-6 pt-12 pb-6 rounded-b-[2rem] shadow-sm mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Portfolio
          </h1>
          <button className="p-2 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
        </div>

        {/* Debt Summary Card */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl relative overflow-hidden shadow-xl shadow-slate-900/10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            Total Outstanding Balance
          </p>
          <h2 className="text-3xl font-bold mb-4">
            KSH {totalDebt.toLocaleString()}
          </h2>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/app/apply")}
              className="flex-1 bg-white text-slate-900 py-3 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors"
            >
              Top Up
            </button>
            <button className="flex-1 bg-white/10 text-white py-3 rounded-xl text-sm font-bold hover:bg-white/20 transition-colors backdrop-blur-sm">
              Pay All
            </button>
          </div>
        </div>
      </div>

      <div
        className={`px-6 space-y-6 transition-all duration-700 ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* 2. Controls: Tabs & Search */}
        <div className="space-y-4">
          {/* Segmented Tabs */}
          <div className="bg-slate-200/50 p-1 rounded-2xl flex relative">
            <button
              onClick={() => setActiveTab("active")}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 relative z-10 ${
                activeTab === "active"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 relative z-10 ${
                activeTab === "history"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              History
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
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
              placeholder="Search loans by ID or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-shadow"
            />
          </div>
        </div>

        {/* 3. Loan Cards */}
        <div className="space-y-4">
          {filteredLoans.length > 0 ? (
            filteredLoans.map((loan, i) => (
              <div
                key={loan.id}
                className="bg-white rounded-[1.5rem] p-5 border border-slate-100 shadow-sm active:scale-[0.99] transition-transform"
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        loan.status === "OVERDUE"
                          ? "bg-red-50 text-red-500"
                          : "bg-blue-50 text-blue-600"
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
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{loan.type}</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        {loan.id}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`
                         px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                         ${
                           loan.status === "ACTIVE"
                             ? "bg-blue-50 text-blue-600 border border-blue-100"
                             : ""
                         }
                         ${
                           loan.status === "OVERDUE"
                             ? "bg-red-50 text-red-600 border border-red-100 animate-pulse"
                             : ""
                         }
                         ${
                           loan.status === "PAID"
                             ? "bg-green-50 text-green-600 border border-green-100"
                             : ""
                         }
                      `}
                  >
                    {loan.status}
                  </span>
                </div>

                {/* Amount Display */}
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-extrabold text-slate-900">
                    KSH {loan.amount.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    @ {loan.interest} interest
                  </span>
                </div>

                {/* Progress Bar (Only active) */}
                {loan.status !== "PAID" && (
                  <div className="mb-5">
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-slate-500">
                        Repaid:{" "}
                        <span className="text-slate-900">
                          {(loan.amount - loan.balance).toLocaleString()}
                        </span>
                      </span>
                      <span className="text-slate-500">
                        Left:{" "}
                        <span className="text-red-500">
                          {loan.balance.toLocaleString()}
                        </span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          loan.status === "OVERDUE"
                            ? "bg-red-500"
                            : "bg-slate-900"
                        }`}
                        style={{
                          width: `${
                            ((loan.amount - loan.balance) / loan.amount) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Due Date
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {loan.dueDate}
                    </p>
                  </div>

                  {loan.status !== "PAID" ? (
                    <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-slate-900/20 active:scale-95 transition-transform">
                      Repay Now
                    </button>
                  ) : (
                    <button className="text-slate-400 flex items-center gap-1 text-xs font-bold px-3 py-2 bg-slate-50 rounded-lg">
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
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Receipt
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-slate-900 font-bold text-lg">
                No Loans Found
              </h3>
              <p className="text-slate-500 text-sm max-w-[200px] mt-1">
                {searchQuery
                  ? "Try searching for a different keyword."
                  : "You have no records in this category."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
