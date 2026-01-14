import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { SUPPORT_EMAIL } from "../../config/support";

export default function Customers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      const q = collection(db, "users");
      const snap = await getDocs(q);
      const items = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          loanLimit: data.loanLimit ?? data.limit ?? 0,
        };
      });
      // Exclude admin account(s) from the customers list
      const filtered = items.filter(
        (u) => (u.role || "customer") !== "admin" && u.email !== SUPPORT_EMAIL
      );
      setUsers(filtered);
      setLoading(false);
    };

    loadUsers();
  }, []);

  const saveLoanLimit = async (userId, newLimit) => {
    const numeric = Number(newLimit);
    if (isNaN(numeric) || numeric < 0) {
      alert("Please enter a valid non-negative number for the loan limit.");
      return;
    }

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { loanLimit: numeric });
      alert("Loan limit updated");
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, loanLimit: numeric } : u))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update loan limit");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">Customers ({users.length})</h1>

      {loading && <p className="text-sm text-muted">Loading...</p>}

      {!loading && users.length === 0 && (
        <div className="card">
          <p className="text-sm text-muted">No customers yet.</p>
        </div>
      )}

      {users.map((user) => (
        <div key={user.id} className="card space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{user.name || user.email}</p>
              <p className="text-sm text-muted">Phone: {user.phone || "-"}</p>
              <p className="text-sm text-muted">
                Role: {user.role || "customer"}
              </p>
            </div>
            <div className="w-40">
              <label className="text-xs text-slate-400">Loan Limit (KSH)</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="number"
                  value={user.loanLimit || 0}
                  min={0}
                  onChange={(e) =>
                    setUsers((prev) =>
                      prev.map((u) =>
                        u.id === user.id
                          ? { ...u, loanLimit: e.target.value }
                          : u
                      )
                    )
                  }
                  className="w-24 p-2 border rounded"
                />
                <button
                  className="btn-secondary"
                  onClick={() => saveLoanLimit(user.id, user.loanLimit || 0)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
