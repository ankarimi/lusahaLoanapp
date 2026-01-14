import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "audit_logs"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setLogs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const removeLog = async (id) => {
    if (!confirm("Delete this audit log? This action is irreversible.")) return;
    try {
      await deleteDoc(doc(db, "audit_logs", id));
      alert("Deleted.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete log.");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">Audit Logs</h1>

      {loading && <p className="text-sm text-muted">Loading...</p>}

      {!loading && logs.length === 0 && (
        <div className="card">
          <p className="text-sm text-muted">No audit logs available.</p>
        </div>
      )}

      {logs.map((l) => (
        <div key={l.id} className="card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted">{l.type}</p>
              <p className="font-semibold">{l.email || l.userId || "-"}</p>
              <p className="text-xs text-muted mt-1">
                {new Date(l.createdAt).toLocaleString()}
              </p>
              {l.note && <p className="text-sm mt-2">{l.note}</p>}
            </div>
            <div className="text-right">
              <button
                className="btn-secondary mb-2"
                onClick={() => navigator.clipboard.writeText(JSON.stringify(l))}
              >
                Copy
              </button>
              <button
                className="text-sm text-red-600"
                onClick={() => removeLog(l.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
