import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/auth.service";

export default function Dashboard() {
  const { user, userData, token } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      alert("Error logging out: " + err.message);
    }
  };

  if (!user || !userData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Welcome, {userData.full_name}!</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </header>

      <div style={styles.content}>
        <div style={styles.card}>
          <h3>User Information</h3>
          <div style={styles.infoGroup}>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong>{" "}
              <span style={styles.badge}>{userData.role?.toUpperCase()}</span>
            </p>
            <p>
              <strong>User ID:</strong> {user.uid}
            </p>
            <p>
              <strong>Account Status:</strong>{" "}
              <span style={styles.activeBadge}>Active</span>
            </p>
          </div>
        </div>

        <div style={styles.card}>
          <h3>Academic Information</h3>
          <div style={styles.infoGroup}>
            <p>
              <strong>University:</strong> {userData.university_id || "Not set"}
            </p>
            <p>
              <strong>Department:</strong> {userData.department_id || "Not set"}
            </p>
            <p>
              <strong>Level:</strong> {userData.level_id || "Not set"}
            </p>
          </div>
        </div>

        <div style={styles.card}>
          <h3>Session Information</h3>
          <div style={styles.infoGroup}>
            <p>
              <strong>Token:</strong>{" "}
              <code style={styles.code}>{token?.slice(0, 20)}...</code>
            </p>
            <p>
              <strong>Session Status:</strong>{" "}
              <span style={styles.activeBadge}>Active</span>
            </p>
          </div>
        </div>

        {userData.role === "admin" || userData.role === "super_admin" ? (
          <div style={styles.card}>
            <h3>Admin Access</h3>
            <p>You have admin privileges.</p>
            <button
              onClick={() => navigate("/admin")}
              style={styles.adminButton}
            >
              Go to Admin Panel
            </button>
          </div>
        ) : (
          <div style={styles.card}>
            <h3>Quick Links</h3>
            <button onClick={() => navigate("/")} style={styles.primaryButton}>
              View Notes
            </button>
            <button
              onClick={() => navigate("/events")}
              style={styles.primaryButton}
            >
              View Events
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoutButton: {
    padding: "10px 15px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  infoGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#e7f3ff",
    color: "#0056b3",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
  },
  activeBadge: {
    display: "inline-block",
    backgroundColor: "#d4edda",
    color: "#155724",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
  },
  code: {
    backgroundColor: "#f5f5f5",
    padding: "4px 8px",
    borderRadius: "4px",
    fontFamily: "monospace",
    fontSize: "12px",
  },
  primaryButton: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  adminButton: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    backgroundColor: "#6f42c1",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
