// src\components\BottomNav.jsx
import { NavLink, useLocation } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();

  // Simple Haptic Feedback Helper
  const triggerHaptic = () => {
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const navItems = [
    {
      to: "/app/home",
      label: "Home",
      icon: (active) => (
        <svg
          className="w-6 h-6 transition-transform duration-300"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M9.15323 3.65518L4.02898 7.58784C3.06456 8.32801 2.5 9.47547 2.5 10.6905V17.0001C2.5 19.2092 4.29086 21.0001 6.5 21.0001H17.5C19.7091 21.0001 21.5 19.2092 21.5 17.0001V10.6905C21.5 9.47547 20.9354 8.32801 19.971 7.58784L14.8468 3.65518C13.1925 2.38549 10.8075 2.38549 9.15323 3.65518Z"
            stroke="currentColor"
            strokeWidth={active ? "0" : "1.5"}
            fill={active ? "currentColor" : "none"}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {active && (
            <path
              d="M10 21V15C10 13.8954 10.8954 13 12 13V13C13.1046 13 14 13.8954 14 15V21"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      ),
    },
    {
      to: "/app/loans",
      label: "Loans",
      icon: (active) => (
        <svg
          className="w-6 h-6 transition-transform duration-300"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M2 11C2 7.70017 2 6.05025 3.02513 5.02513C4.05025 4 5.70017 4 9 4H10C13.2998 4 14.9497 4 15.9749 5.02513C17 6.05025 17 7.70017 17 11V13C17 16.2998 17 17.9497 15.9749 18.9749C14.9497 20 13.2998 20 10 20H9C5.70017 20 4.05025 20 3.02513 18.9749C2 17.9497 2 16.2998 2 13V11Z"
            stroke="currentColor"
            strokeWidth={active ? "0" : "1.5"}
            fill={active ? "currentColor" : "none"}
          />
          <path
            d="M17 8H18C19.8856 8 20.8284 8 21.4142 8.58579C22 9.17157 22 10.1144 22 12V13C22 14.8856 22 15.8284 21.4142 16.4142C20.8284 17 19.8856 17 18 17H17"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle
            cx="9.5"
            cy="12"
            r={active ? "2.5" : "2"}
            fill={active ? "white" : "currentColor"}
            opacity={active ? "1" : "0.4"}
          />
        </svg>
      ),
    },
    {
      to: "/app/apply",
      label: "Apply",
      isFloating: true,
      icon: (active) => (
        <svg
          className="w-8 h-8 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },
    {
      to: "/app/support",
      label: "Support",
      icon: (active) => (
        <svg
          className="w-6 h-6 transition-transform duration-300"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z"
            stroke="currentColor"
            strokeWidth={active ? "0" : "1.5"}
            fill={active ? "currentColor" : "none"}
          />
          <path
            d="M8 12H8.01M12 12H12.01M16 12H16.01"
            stroke={active ? "white" : "currentColor"}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      to: "/app/profile",
      label: "Profile",
      icon: (active) => (
        <svg
          className="w-6 h-6 transition-transform duration-300"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="9"
            r="3"
            stroke="currentColor"
            strokeWidth={active ? "0" : "1.5"}
            fill={active ? "currentColor" : "none"}
          />
          <path
            d="M17.9975 18C18 17.8358 18 17.669 18 17.5C18 15.0147 15.3137 13 12 13C8.68629 13 6 15.0147 6 17.5C6 17.669 6 17.8358 6.00252 18H17.9975Z"
            stroke="currentColor"
            strokeWidth={active ? "0" : "1.5"}
            fill={active ? "currentColor" : "none"}
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="1.5"
            className={active ? "opacity-0" : "opacity-100"}
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Spacer to prevent content overlapping */}
      <div className="h-24 w-full bg-transparent pointer-events-none" />

      {/* Navigation Container */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Decorative Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-50"></div>

        <div className="bg-white/90 backdrop-blur-xl border-t border-slate-200/50 pb-safe shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
          <div className="flex justify-around items-end h-[4.5rem] px-2 relative">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;

              // --- FLOATING ACTION BUTTON (APPLY) ---
              if (item.isFloating) {
                return (
                  <div key={item.label} className="relative -top-8 group">
                    {/* Pulsing Ring Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-accent opacity-20 group-hover:animate-ping"></div>

                    <NavLink
                      to={item.to}
                      onClick={triggerHaptic}
                      className={`
                        flex items-center justify-center w-16 h-16 rounded-[1.2rem] shadow-xl shadow-accent/30
                        transition-all duration-300 transform group-hover:scale-105 active:scale-95 group-hover:-rotate-3
                        bg-gradient-to-tr from-green-500 to-emerald-400 border-[3px] border-white
                      `}
                    >
                      {item.icon(isActive)}
                    </NavLink>
                  </div>
                );
              }

              // --- STANDARD NAV ITEM ---
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={triggerHaptic}
                  className={({ isActive }) => `
                    flex flex-col items-center justify-center w-16 h-full pb-2
                    transition-all duration-300 relative group
                    ${
                      isActive
                        ? "text-primary"
                        : "text-slate-400 hover:text-slate-500"
                    }
                  `}
                >
                  {/* Active Indicator Background Pill */}
                  <div
                    className={`
                        absolute top-2 w-10 h-8 rounded-full bg-primary/5 transition-all duration-300
                        ${
                          isActive
                            ? "scale-100 opacity-100"
                            : "scale-0 opacity-0"
                        }
                    `}
                  ></div>

                  {/* Icon */}
                  <div
                    className={`
                    relative z-10 transition-transform duration-300 
                    ${
                      isActive
                        ? "transform -translate-y-1 scale-110 drop-shadow-sm"
                        : "group-hover:scale-105"
                    }
                  `}
                  >
                    {item.icon(isActive)}
                  </div>

                  {/* Label */}
                  <span
                    className={`
                    text-[10px] font-bold transition-all duration-300 absolute bottom-3
                    ${
                      isActive
                        ? "opacity-100 translate-y-0 text-primary"
                        : "opacity-0 translate-y-2"
                    }
                  `}
                  >
                    {item.label}
                  </span>

                  {/* Inactive Dot (Optional, replaces label when inactive) */}
                  <span
                    className={`
                    w-1 h-1 rounded-full bg-slate-300 absolute bottom-4 transition-all duration-300
                    ${
                      isActive
                        ? "opacity-0 scale-0"
                        : "opacity-0 group-hover:opacity-100"
                    }
                  `}
                  ></span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
