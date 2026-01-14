import React, { useEffect, useState } from "react";
import { db } from "../../../../src/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function Departments() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, "departments"));
      setDepartments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }
    load();
  }, []);

  return (
    <div className="container">
      <h2>Departments</h2>
      {departments.map((d) => (
        <div key={d.id} className="card">
          <Link to={`/notes/${d.id}/levels`}>
            <strong>{d.name}</strong>
          </Link>
        </div>
      ))}
    </div>
  );
}
