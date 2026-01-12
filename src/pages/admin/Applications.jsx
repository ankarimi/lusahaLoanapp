import { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "loans"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const items = await Promise.all(
        snapshot.docs.map(async (d) => {
          const data = d.data();
          let user = null;
          try {
            const userRef = doc(db, "users", data.userId);
            const userSnap = await getDoc(userRef);
            user = userSnap.exists() ? userSnap.data() : null;
          } catch (err) {
            console.error(err);
          }
          return { id: d.id, ...data, user };
        })
      );
      setApplications(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const approve = async (app) => {
    if (!confirm("Approve this loan application?")) return;
    try {
      const loanRef = doc(db, "loans", app.id);
      const due = new Date(Date.now() + app.durationDays * 24 * 3600 * 1000);
      await updateDoc(loanRef, {
        status: "approved",
        approvedAt: serverTimestamp(),
        approverId: auth.currentUser?.uid || null,
        dueDate: due,
      });
      alert("Loan approved.");
    } catch (err) {
      console.error(err);
      alert("Failed to approve loan.");
    }
  };

  const decline = async (app) => {
    if (!confirm("Decline this loan application?")) return;
    try {
      const loanRef = doc(db, "loans", app.id);
      await updateDoc(loanRef, {
        status: "declined",
        reviewedAt: serverTimestamp(),
        reviewerId: auth.currentUser?.uid || null,
      });
      alert("Loan declined.");
    } catch (err) {
      console.error(err);
      alert("Failed to decline loan.");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">Loan Applications</h1>

      {loading && <p className="text-sm text-muted">Loading...</p>}

      {!loading && applications.length === 0 && (
        <div className="card">
          <p className="text-sm text-muted">No applications yet.</p>
        </div>
      )}

      {applications.map((app) => (
        <div key={app.id} className="card space-y-2">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">{app.user?.name || "Unknown"}</p>
              <p className="text-sm text-muted">Phone: {app.phoneUsed}</p>
              <p className="text-sm text-muted">Purpose: {app.purpose}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                KSH {app.amount?.toLocaleString()}
              </p>
              <p className="text-sm text-muted">{app.durationDays} days</p>
              <p className="text-sm text-muted">Status: {app.status}</p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button className="flex-1 btn-secondary" onClick={() => {}}>
              View
            </button>
            <button
              className="flex-1 bg-accent text-black p-2 rounded"
              onClick={() => approve(app)}
            >
              Approve
            </button>
            <button
              className="flex-1 bg-danger p-2 rounded"
              onClick={() => decline(app)}
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
