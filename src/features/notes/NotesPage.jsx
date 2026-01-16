import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchNotesByCourse } from "../../features/notes/notes.service";

export default function NotesPage() {
  const { userData } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?.university_id) return;

    const loadNotes = async () => {
      try {
        // Fetch notes - adjust courseId based on your needs
        const fetchedNotes = await fetchNotesByCourse(
          "course_001",
          userData.university_id
        );
        setNotes(fetchedNotes);
      } catch (err) {
        console.error("Error loading notes:", err);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [userData?.university_id]);

  if (loading) return <div style={styles.container}>Loading notes...</div>;

  return (
    <div style={styles.container}>
      <h1>Study Notes</h1>

      {notes.length === 0 ? (
        <div style={styles.empty}>
          <p>No notes available yet.</p>
          <button style={styles.button}>Upload Note</button>
        </div>
      ) : (
        <div style={styles.grid}>
          {notes.map((note) => (
            <div key={note.id} style={styles.noteCard}>
              <h3>{note.title}</h3>
              <p>{note.description}</p>
              <p style={styles.meta}>by {note.uploader_name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  empty: {
    textAlign: "center",
    padding: "40px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  noteCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  meta: {
    fontSize: "12px",
    color: "#666",
    marginTop: "10px",
  },
};
