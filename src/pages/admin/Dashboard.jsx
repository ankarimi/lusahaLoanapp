import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({
    active: 0,
    overdue: 0,
    pending: 0,
    customers: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Loans
        const loansSnap = await getDocs(collection(db, "loans"));
        const loans = loansSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const active = loans.filter((l) => l.status === "approved").length;
        const pending = loans.filter((l) => l.status === "under_review").length;
        const overdue = loans.filter(
          (l) =>
            l.dueDate &&
            new Date(l.dueDate.toDate ? l.dueDate.toDate() : l.dueDate) <
              new Date() &&
            l.status === "approved"
        ).length;

        // Customers
        const usersSnap = await getDocs(collection(db, "users"));
        const customers = usersSnap.docs.length;

        setStats({ active, overdue, pending, customers });
      } catch (err) {
        console.error(err);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="p-4 space-y-4">
      {/* Top Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card">
          <p className="text-xs text-muted">Cash Available</p>
          <p className="text-lg font-bold">KSH 0</p>
        </div>

        <div className="card">
          <p className="text-xs text-muted">Active Loans</p>
          <p className="text-lg font-bold">{stats.active}</p>
        </div>

        <div className="card">
          <p className="text-xs text-muted">Overdue Loans</p>
          <p className="text-lg font-bold text-danger">{stats.overdue}</p>
        </div>

        <div className="card">
          <p className="text-xs text-muted">Pending Applications</p>
          <p className="text-lg font-bold">{stats.pending}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <p className="font-semibold mb-2">Quick Actions</p>

        <div className="space-y-2">
          <button
            className="btn-secondary w-full"
            onClick={() => navigate("/admin/applications")}
          >
            Review Applications
          </button>

          <button
            className="btn-secondary w-full"
            onClick={() => navigate("/admin/customers")}
          >
            View Customers
          </button>

          <button
            className="btn-secondary w-full"
            onClick={() => navigate("/admin/loans")}
          >
            Manage Loans
          </button>

          <button
            className="btn-secondary w-full"
            onClick={() => navigate("/admin/audit-logs")}
          >
            View Audit Logs
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="card">
        <p className="font-semibold mb-1">System Status</p>
        <p className="text-sm text-muted">
          Lending is currently{" "}
          <span className="text-accent font-semibold">ACTIVE</span>
        </p>
      </div>
    </div>
  );
}
