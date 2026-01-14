import React, { useEffect, useState } from "react";
import { db } from "../../../../src/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";

export default function Levels() {
  const { departmentId } = useParams();
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    async function load() {
      const q = query(
        collection(db, "levels"),
        where("department_id", "==", departmentId)
      );
      const snap = await getDocs(q);
      setLevels(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }
    load();
  }, [departmentId]);

  return (
    <div className="container">
      <h2>Levels</h2>
      {levels.map((l) => (
        <div key={l.id} className="card">
          <Link to={`/notes/${departmentId}/levels/${l.id}/courses`}>
            <strong>{l.name}</strong>
          </Link>
        </div>
      ))}
    </div>
  );
}
