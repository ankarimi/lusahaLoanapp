import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const snap = await getDocs(collection(db, "users"));
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }
    load();
  }, []);

  async function promote(u) {
    if (!u.university_id) return alert("User has no university");
    // count admins in this university
    const q = query(
      collection(db, "users"),
      where("university_id", "==", u.university_id),
      where("role", "==", "admin")
    );
    const snap = await getDocs(q);
    if (snap.size >= 3) return alert("This university already has 3 admins");

    try {
      await updateDoc(doc(db, "users", u.id), { role: "admin" });
      setUsers((us) =>
        us.map((x) => (x.id === u.id ? { ...x, role: "admin" } : x))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to promote");
    }
  }

  async function demote(u) {
    try {
      await updateDoc(doc(db, "users", u.id), { role: "student" });
      setUsers((us) =>
        us.map((x) => (x.id === u.id ? { ...x, role: "student" } : x))
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Users</h2>
      {loading && <div>Loading...</div>}
      {users.map((u) => (
        <div
          key={u.id}
          style={{
            border: "1px solid #eee",
            padding: 12,
            borderRadius: 8,
            marginBottom: 8,
          }}
        >
          <div>
            <strong>{u.full_name || u.email}</strong>{" "}
            <small>({u.role || "student"})</small>
          </div>
          <div style={{ fontSize: 12 }}>{u.university_id}</div>
          <div style={{ marginTop: 8 }}>
            {u.role !== "admin" && (
              <button onClick={() => promote(u)} style={{ marginRight: 8 }}>
                Promote to admin
              </button>
            )}
            {u.role === "admin" && (
              <button onClick={() => demote(u)}>Demote to student</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
