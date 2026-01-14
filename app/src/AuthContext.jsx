import React, { createContext, useEffect, useState, useContext } from "react";
import { auth, db } from "../../src/firebase";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();
export function useAuth(){ return useContext(AuthContext); }

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async (u)=>{
      setUser(u);
      if(u){
        const p = await getDoc(doc(db, 'users', u.uid));
        setProfile(p.exists() ? p.data() : null);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  },[]);

  async function register({ email, password, full_name, university_id }){
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const uid = res.user.uid;
    await setDoc(doc(db, 'users', uid), {
      id: uid,
      full_name,
      email,
      university_id,
      role: 'student',
      created_at: new Date()
    });
    // profile will be picked up by onAuthStateChanged
    return res.user;
  }

  async function login({ email, password }){
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function logout(){
    await signOut(auth);
  }

  const value = { user, profile, loading, register, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
