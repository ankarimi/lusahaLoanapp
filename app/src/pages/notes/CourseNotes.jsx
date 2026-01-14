import React, { useEffect, useState } from "react";
import { db } from "../../../../src/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useParams } from "react-router-dom";

export default function CourseNotes() {
  const { courseId } = useParams();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function load() {
      const q = query(
        collection(db, "notes"),
        where("course_id", "==", courseId),
        where("status", "==", "approved")
      );
      const snap = await getDocs(q);
      setNotes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }
    load();
  }, [courseId]);

  return (
    <div className="container">
      <h2>Notes</h2>
      {notes.length === 0 && <div className="card">No notes</div>}
      {notes.map((n) => (
        <div key={n.id} className="card">
          <strong>{n.title}</strong>
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
