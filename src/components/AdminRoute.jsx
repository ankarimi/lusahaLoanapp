import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const TOKEN_KEY = "authToken";
const USER_ID_KEY = "authUserId";

export default function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function check() {
      const token =
        typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
      const uid =
        typeof window !== "undefined"
          ? localStorage.getItem(USER_ID_KEY)
          : null;
      if (!token || !uid) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", uid));
        if (!snap.exists()) {
          setAllowed(false);
        } else {
          const role = snap.data().role;
          setAllowed(role === "admin" || role === "super_admin");
        }
      } catch (err) {
        console.warn("AdminRoute: failed to verify user role", err);
        setAllowed(false);
      }
      setLoading(false);
    }
    check();
  }, []);

  if (loading)
    return <div style={{ padding: 12 }}>Checking permissions...</div>;
  if (!allowed) return <Navigate to="/login" replace />;
  return children;
}
