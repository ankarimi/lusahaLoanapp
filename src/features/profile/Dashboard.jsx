import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../services/auth.service";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  BookOpen,
  Calendar,
  UploadCloud,
  Search,
  ShieldAlert,
  ChevronRight,
  Bell,
  X,
  Home,
  User,
  Settings,
  Clock,
  Zap,
  MoreHorizontal,
} from "lucide-react";

// --- Font Injection ---
const FontStyles = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
      body { margin: 0; padding: 0; overflow-x: hidden; background-color: #F3F4F6; }
      
      /* Hide scrollbar for clean UI */
      ::-webkit-scrollbar { width: 0px; background: transparent; }
    `}
  </style>
);

export default function Dashboard() {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [greeting, setGreeting] = useState("Welcome");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (!user || !userData) return <LoadingScreen />;

  const isAdmin = userData.role === "admin" || userData.role === "super_admin";

  return (
    <>
      <FontStyles />
      <div style={styles.pageContainer}>
        {/* --- DYNAMIC MESH BACKGROUND --- */}
        <div style={styles.meshBackground}>
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              ...styles.meshOrb,
              top: "-20%",
              left: "-10%",
              background: "#6366f1",
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            style={{
              ...styles.meshOrb,
              top: "40%",
              right: "-20%",
              background: "#ec4899",
            }}
          />
          <motion.div
            animate={{ x: [-50, 50, -50] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            style={{
              ...styles.meshOrb,
              bottom: "-20%",
              left: "20%",
              background: "#06b6d4",
            }}
          />
          <div style={styles.glassOverlay} />
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div
          style={{
            ...styles.contentContainer,
            filter: showLogoutModal ? "blur(8px)" : "none",
          }}
        >
          {/* HEADER */}
          <header style={styles.header}>
            <div style={styles.headerProfile}>
              <div style={styles.avatar}>
                {userData.full_name?.charAt(0) || "U"}
              </div>
              <div style={styles.headerText}>
                <span style={styles.greeting}>{greeting}</span>
                <h1 style={styles.userName}>
                  {userData.full_name?.split(" ")[0]}
                </h1>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              style={styles.notificationBtn}
            >
              <Bell size={20} color="#1f2937" />
              <div style={styles.notificationDot} />
            </motion.button>
          </header>
          {/* PRODUCTIVITY WIDGET ROW */}
          <div style={styles.widgetRow}>
            {/* Progress Widget */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={styles.productivityCard}
            >
              <div style={styles.widgetHeader}>
                <Zap size={16} color="#F59E0B" />
                <span style={styles.widgetLabel}>Semester Focus</span>
              </div>
              <div style={styles.progressBarBg}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  transition={{ delay: 0.5, duration: 1 }}
                  style={styles.progressBarFill}
                />
              </div>
              <span style={styles.widgetValue}>65% Complete</span>
            </motion.div>

            {/* Time Widget */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={styles.productivityCard}
            >
              <div style={styles.widgetHeader}>
                <Clock size={16} color="#3B82F6" />
                <span style={styles.widgetLabel}>Next Class</span>
              </div>
              <span style={styles.timeValue}>02:30 PM</span>
              <span style={styles.classValue}>Intro to CS</span>
            </motion.div>
          </div>
          {/* BENTO GRID LAYOUT */}
          <div style={styles.bentoGrid}>
            {/* DIGITAL PASS (Large Item) */}
            <motion.div
              style={styles.bentoPass}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div style={styles.passHeader}>
                <span style={styles.uniBadge}>
                  {userData.university_name || "University"}
                </span>
                <ShieldAlert size={18} color="rgba(255,255,255,0.8)" />
              </div>
              <div style={styles.passBody}>
                <h3 style={styles.passRole}>{userData.role}</h3>
                <div style={styles.passDetails}>
                  <p>{userData.department_id || "Dept. Unset"}</p>
                  <p>•</p>
                  <p>{userData.level_id || "Lvl. Unset"}</p>
                </div>
              </div>
              <div style={styles.passFooter}>
                <span style={styles.passId}>ID: {user.uid.slice(0, 8)}</span>
                <div style={styles.activeDot} />
              </div>
            </motion.div>

            {/* ACTION TILES */}
            <BentoTile
              title="Notes"
              icon={<BookOpen size={22} color="white" />}
              color="#8B5CF6"
              delay={0.3}
              onClick={() => navigate("/notes")}
            />
            <BentoTile
              title="Events"
              icon={<Calendar size={22} color="white" />}
              color="#EC4899"
              delay={0.4}
              onClick={() => navigate("/events")}
            />
            <BentoTile
              title="Upload"
              icon={<UploadCloud size={22} color="white" />}
              color="#10B981"
              delay={0.5}
              onClick={() => navigate("/notes/upload")}
            />
            <BentoTile
              title="Explore"
              icon={<Search size={22} color="white" />}
              color="#3B82F6"
              delay={0.6}
              onClick={() => navigate("/explore")}
            />

            {isAdmin && (
              <motion.div
                style={styles.adminTile}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/admin")}
              >
                <span>Admin Panel</span>
                <ChevronRight size={16} />
              </motion.div>
            )}
          </div>
          <div style={{ height: "100px" }} /> {/* Spacer for dock */}
        </div>

        {/* --- FLOATING DOCK NAVIGATION --- */}
        <FloatingDock
          activeRoute={location.pathname}
          onLogout={() => setShowLogoutModal(true)}
        />

        {/* --- LOGOUT MODAL --- */}
        <AnimatePresence>
          {showLogoutModal && (
            <LogoutModal
              onClose={() => setShowLogoutModal(false)}
              onConfirm={handleLogoutConfirm}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// --- SUB-COMPONENTS ---

const BentoTile = ({ title, icon, color, onClick, delay }) => (
  <motion.button
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    style={styles.bentoTile}
  >
    <div style={{ ...styles.tileIcon, backgroundColor: color }}>{icon}</div>
    <span style={styles.tileTitle}>{title}</span>
  </motion.button>
);

const FloatingDock = ({ onLogout }) => (
  <motion.div
    initial={{ y: 100 }}
    animate={{ y: 0 }}
    style={styles.dockContainer}
  >
    <div style={styles.dock}>
      <DockItem icon={<Home size={22} />} active />
      <DockItem icon={<Clock size={22} />} />
      <div style={styles.dockDivider} />
      <DockItem icon={<User size={22} />} />
      <DockItem
        icon={<LogOut size={22} color="#EF4444" />}
        onClick={onLogout}
      />
    </div>
  </motion.div>
);

const DockItem = ({ icon, active, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    style={{ ...styles.dockItem, color: active ? "#6366f1" : "#9CA3AF" }}
  >
    {icon}
    {active && (
      <motion.div layoutId="dockActive" style={styles.dockActiveDot} />
    )}
  </motion.button>
);

const LogoutModal = ({ onClose, onConfirm }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    style={styles.modalOverlay}
  >
    <motion.div
      initial={{ scale: 0.9, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.9, y: 20, opacity: 0 }}
      style={styles.modalCard}
    >
      <button onClick={onClose} style={styles.closeModalBtn}>
        <X size={20} />
      </button>
      <SadGhost />
      <h3 style={styles.modalTitle}>Ending Session?</h3>
      <p style={styles.modalText}>
        You are about to log out. All unsaved progress in uploads will be lost.
      </p>
      <div style={styles.modalGrid}>
        <button onClick={onClose} style={styles.cancelBtn}>
          Cancel
        </button>
        <button onClick={onConfirm} style={styles.confirmBtn}>
          Logout
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const SadGhost = () => (
  <div style={styles.ghostWrapper}>
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      style={styles.ghostContainer}
    >
      <div style={styles.ghostBody}>
        <div style={styles.ghostFace}>
          <div style={styles.ghostEyes}>
            <div style={styles.eye} />
            <div style={styles.eye} />
          </div>
          <div style={styles.ghostMouth} />
        </div>
      </div>
    </motion.div>
    <div style={styles.ghostShadow} />
  </div>
);

const LoadingScreen = () => (
  <div
    style={{
      height: "100vh",
      display: "grid",
      placeItems: "center",
      background: "#F3F4F6",
    }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8 }}
      style={{
        width: 30,
        height: 30,
        border: "3px solid #E5E7EB",
        borderTopColor: "#6366F1",
        borderRadius: "50%",
      }}
    />
  </div>
);

// --- STYLES (Inline CSS for portability) ---

const styles = {
  pageContainer: {
    minHeight: "100vh",
    width: "100%",
    fontFamily: "'Montserrat', sans-serif",
    position: "relative",
    color: "#1F2937",
    overflow: "hidden",
  },

  // MESH BACKGROUND
  meshBackground: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "#F3F4F6", // Light grey base
    zIndex: 0,
  },
  meshOrb: {
    position: "absolute",
    borderRadius: "50%",
    width: "600px",
    height: "600px",
    filter: "blur(100px)",
    opacity: 0.4,
  },
  glassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backdropFilter: "blur(60px)",
    background: "rgba(255,255,255,0.4)",
  },

  contentContainer: {
    position: "relative",
    zIndex: 1,
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    transition: "filter 0.3s ease",
  },

  // HEADER
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    paddingTop: "10px",
  },
  headerProfile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    backgroundColor: "#1F2937",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "bold",
  },
  headerText: { display: "flex", flexDirection: "column" },
  greeting: {
    fontSize: "12px",
    color: "#6B7280",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  userName: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#111827",
    margin: 0,
  },
  notificationBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.5)",
    backgroundColor: "rgba(255,255,255,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    cursor: "pointer",
  },
  notificationDot: {
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "8px",
    height: "8px",
    backgroundColor: "#EF4444",
    borderRadius: "50%",
    border: "1px solid white",
  },

  // WIDGET ROW
  widgetRow: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: "12px",
    marginBottom: "20px",
  },
  productivityCard: {
    backgroundColor: "white",
    padding: "16px",
    borderRadius: "18px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100px",
  },
  widgetHeader: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "8px",
  },
  widgetLabel: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
  },
  progressBarBg: {
    width: "100%",
    height: "6px",
    backgroundColor: "#E5E7EB",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "6px",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#F59E0B",
    borderRadius: "10px",
  },
  widgetValue: { fontSize: "13px", fontWeight: "700", color: "#111827" },
  timeValue: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#111827",
    lineHeight: "1",
  },
  classValue: { fontSize: "12px", color: "#6B7280", fontWeight: "500" },

  // BENTO GRID
  bentoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  bentoPass: {
    gridColumn: "span 2",
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    borderRadius: "22px",
    padding: "20px",
    color: "white",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  },
  passHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    opacity: 0.8,
  },
  uniBadge: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  passBody: { marginTop: "5px" },
  passRole: {
    fontSize: "22px",
    fontWeight: "800",
    margin: "0 0 4px 0",
    color: "#FBBF24",
  }, // Amber color for role
  passDetails: {
    display: "flex",
    gap: "8px",
    fontSize: "13px",
    color: "#94A3B8",
  },
  passFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "11px",
    fontFamily: "monospace",
    opacity: 0.6,
  },
  activeDot: {
    width: "6px",
    height: "6px",
    backgroundColor: "#10B981",
    borderRadius: "50%",
    boxShadow: "0 0 8px #10B981",
  },

  bentoTile: {
    backgroundColor: "white",
    border: "none",
    borderRadius: "20px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    alignItems: "flex-start",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
    cursor: "pointer",
    height: "110px",
  },
  tileIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  },
  tileTitle: { fontSize: "15px", fontWeight: "700", color: "#374151" },

  adminTile: {
    gridColumn: "span 2",
    backgroundColor: "#EEF2FF",
    padding: "12px 20px",
    borderRadius: "14px",
    color: "#4F46E5",
    fontWeight: "600",
    fontSize: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },

  // FLOATING DOCK
  dockContainer: {
    position: "fixed",
    bottom: "30px",
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    zIndex: 50,
  },
  dock: {
    backgroundColor: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(12px)",
    padding: "10px 20px",
    borderRadius: "24px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    border: "1px solid rgba(255,255,255,0.6)",
  },
  dockItem: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    position: "relative",
  },
  dockActiveDot: {
    width: "4px",
    height: "4px",
    backgroundColor: "#6366f1",
    borderRadius: "50%",
    position: "absolute",
    bottom: "-6px",
  },
  dockDivider: { width: "1px", height: "24px", backgroundColor: "#E5E7EB" },

  // MODAL
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    backdropFilter: "blur(4px)",
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  modalCard: {
    backgroundColor: "white",
    width: "100%",
    maxWidth: "340px",
    borderRadius: "24px",
    padding: "30px",
    textAlign: "center",
    position: "relative",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  closeModalBtn: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9CA3AF",
  },
  modalTitle: {
    margin: "10px 0 8px",
    fontSize: "18px",
    fontWeight: "800",
    color: "#111827",
  },
  modalText: {
    margin: "0 0 24px",
    fontSize: "13px",
    color: "#6B7280",
    lineHeight: "1.5",
  },
  modalGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  cancelBtn: {
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    background: "white",
    color: "#374151",
    fontWeight: "600",
    cursor: "pointer",
  },
  confirmBtn: {
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    background: "#EF4444",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },

  // GHOST
  ghostWrapper: {
    position: "relative",
    height: "60px",
    width: "60px",
    margin: "0 auto 10px",
  },
  ghostContainer: { position: "relative", zIndex: 2 },
  ghostBody: {
    width: "50px",
    height: "60px",
    backgroundColor: "#F3F4F6",
    borderRadius: "25px 25px 0 0",
    margin: "0 auto",
    position: "relative",
    border: "2px solid #E5E7EB",
    borderBottom: "none",
  },
  ghostFace: { position: "absolute", top: "20px", left: "12px" },
  ghostEyes: { display: "flex", gap: "14px", marginBottom: "4px" },
  eye: {
    width: "5px",
    height: "5px",
    backgroundColor: "#374151",
    borderRadius: "50%",
  },
  ghostMouth: {
    width: "8px",
    height: "4px",
    border: "2px solid #374151",
    borderBottom: "none",
    borderRadius: "50% 50% 0 0",
    margin: "0 auto",
  },
  ghostShadow: {
    width: "40px",
    height: "6px",
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: "50%",
    margin: "0 auto",
    marginTop: "5px",
  },
};
