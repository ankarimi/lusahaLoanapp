import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function EventsPage() {
  const { userData } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?.university_id) return;

    const loadEvents = async () => {
      try {
        const q = query(
          collection(db, "events"),
          where("university_id", "==", userData.university_id)
        );

        const snapshot = await getDocs(q);
        const fetchedEvents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(fetchedEvents);
      } catch (err) {
        console.error("Error loading events:", err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [userData?.university_id]);

  if (loading) return <div style={styles.container}>Loading events...</div>;

  return (
    <div style={styles.container}>
      <h1>Campus Events</h1>

      {events.length === 0 ? (
        <div style={styles.empty}>
          <p>No events scheduled yet.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {events.map((event) => (
            <div key={event.id} style={styles.eventCard}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p style={styles.date}>
                📅 {new Date(event.date?.toDate?.()).toLocaleDateString()}
              </p>
              <p style={styles.location}>📍 {event.location || "TBA"}</p>
              <button style={styles.button}>Register</button>
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  eventCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  date: {
    fontSize: "14px",
    color: "#666",
    marginTop: "10px",
  },
  location: {
    fontSize: "14px",
    color: "#666",
    marginTop: "5px",
  },
  button: {
    marginTop: "15px",
    padding: "8px 16px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    width: "100%",
  },
};
