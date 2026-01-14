import React, { useEffect, useState } from "react";
import { db } from "../../../src/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

export default function Home() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function load() {
      const q = query(
        collection(db, "notes"),
        where("status", "==", "approved"),
        orderBy("created_at", "desc")
      );
      const snap = await getDocs(q);
      setNotes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }
    load();
  }, []);

  return (
    <div className="container">
      <h2>Recent Notes</h2>
      {notes.length === 0 && <div className="card">No notes yet</div>}
      {notes.map((n) => (
        <div key={n.id} className="card">
          <strong>{n.title}</strong>
          <div style={{ fontSize: 12 }}>{n.course_name || ""}</div>
          <div style={{ marginTop: 8 }}>
            <a href={n.file_url} target="_blank" rel="noreferrer">
              Download
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
