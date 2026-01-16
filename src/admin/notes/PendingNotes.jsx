import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import NoteModerationCard from "./NoteModerationCard";
import { useEffect, useState } from "react";

export default function PendingNotes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "notes"), where("status", "==", "pending"));

    getDocs(q).then((snap) =>
      setNotes(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, []);

  return notes.map((note) => <NoteModerationCard key={note.id} note={note} />);
}
