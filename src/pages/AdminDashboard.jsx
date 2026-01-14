import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  orderBy,
} from "firebase/firestore";

export default function AdminDashboard() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const q = query(
        collection(db, "notes"),
        where("status", "==", "pending"),
        orderBy("created_at", "desc")
      );
      const snap = await getDocs(q);
      setPending(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }
    load();
  }, []);

  async function setStatus(id, status) {
    try {
      await updateDoc(doc(db, "notes", id), { status });
      setPending((p) => p.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Pending Notes</h2>
      <div style={{ marginBottom: 12 }}>
        <a href="/">Dashboard</a> · <a href="/universities">Universities</a> ·{" "}
        <a href="/admin/courses">Courses</a>
      </div>
      {loading && <div>Loading...</div>}
      {!loading && pending.length === 0 && <div>No pending notes</div>}
      {pending.map((n) => (
        <div
          key={n.id}
          style={{
            border: "1px solid #ddd",
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <strong>{n.title}</strong>
          <div style={{ fontSize: 12 }}>{n.uploader_user_id}</div>
          <div style={{ marginTop: 8 }}>
            <a href={n.file_url} target="_blank" rel="noreferrer">
              Open file
            </a>
          </div>
          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => setStatus(n.id, "approved")}
              style={{ marginRight: 8 }}
            >
              Approve
            </button>
            <button onClick={() => setStatus(n.id, "rejected")}>Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}
