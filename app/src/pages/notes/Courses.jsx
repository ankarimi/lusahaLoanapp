import React, { useEffect, useState } from "react";
import { db } from "../../../../src/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";

export default function Courses() {
  const { levelId } = useParams();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function load() {
      const q = query(
        collection(db, "courses"),
        where("level_id", "==", levelId)
      );
      const snap = await getDocs(q);
      setCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }
    load();
  }, [levelId]);

  return (
    <div className="container">
      <h2>Courses</h2>
      {courses.map((c) => (
        <div key={c.id} className="card">
          <Link to={`/notes/courses/${c.id}/notes`}>
            <strong>{c.course_name || c.id}</strong>
          </Link>
        </div>
      ))}
    </div>
  );
}
