import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export default function Customers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      const q = collection(db, "users");
      const snap = await getDocs(q);
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsers(items);
      setLoading(false);
    };

    loadUsers();
  }, []);

  const saveLimit = async (userId, newLimit) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { limit: Number(newLimit) });
      alert("Limit updated");
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, limit: Number(newLimit) } : u
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update limit");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">Customers</h1>

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
              <label className="text-xs text-slate-400">Limit</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="number"
                  value={user.limit || 0}
                  min={0}
                  onChange={(e) =>
                    setUsers((prev) =>
                      prev.map((u) =>
                        u.id === user.id ? { ...u, limit: e.target.value } : u
                      )
                    )
                  }
                  className="w-24 p-2 border rounded"
                />
                <button
                  className="btn-secondary"
                  onClick={() => saveLimit(user.id, user.limit || 0)}
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
