import React, { createContext, useEffect, useState, useContext } from "react";
import { auth, db } from "../../src/firebase";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

const TOKEN_KEY = "authToken";
const USER_ID_KEY = "authUserId";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);

  // create a session token and persist to localStorage
  function createSession(firebaseUser) {
    const sessionToken = `${firebaseUser.uid}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(TOKEN_KEY, sessionToken);
    localStorage.setItem(USER_ID_KEY, firebaseUser.uid);
    setToken(sessionToken);
    return sessionToken;
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    setToken(null);
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      const localToken = localStorage.getItem(TOKEN_KEY);

      // If Firebase has a user but there is no local session token, force sign out
      if (u && !localToken) {
        try {
          await signOut(auth);
        } catch (err) {
          console.warn("Failed to sign out when missing session token", err);
        }
        setUser(null);
        setProfile(null);
        setLoading(false);
        setToken(null);
        return;
      }

      setUser(u);
      if (u) {
        const p = await getDoc(doc(db, "users", u.uid));
        setProfile(p.exists() ? p.data() : null);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function register({ email, password, full_name, university_id }) {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const uid = res.user.uid;
    await setDoc(doc(db, "users", uid), {
      id: uid,
      full_name,
      email,
      university_id,
      role: "student",
      created_at: new Date(),
    });
    // create session token
    createSession(res.user);
    return res.user;
  }

  async function login({ email, password }) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    createSession(cred.user);
    return cred.user;
  }

  async function logout() {
    await signOut(auth);
    clearSession();
  }

  const value = { user, profile, loading, token, createSession, clearSession, register, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
