import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, "courses"));
      setCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }
    load();
  }, []);

  async function create() {
    if (!courseName) return;
    await addDoc(collection(db, "courses"), { course_name: courseName });
    setCourseName("");
    const snap = await getDocs(collection(db, "courses"));
    setCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Courses</h2>
      <div style={{ marginBottom: 12 }}>
        <input
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          placeholder="Course name"
        />
        <button onClick={create} style={{ marginLeft: 8 }}>
          Create
        </button>
      </div>
      {courses.map((c) => (
        <div
          key={c.id}
          style={{
            border: "1px solid #eee",
            padding: 12,
            borderRadius: 8,
            marginBottom: 8,
          }}
        >
          <strong>{c.course_name || c.id}</strong>
        </div>
      ))}
    </div>
  );
}
