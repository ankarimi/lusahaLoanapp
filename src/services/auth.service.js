import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

/**
 * REGISTER WITH EMAIL + PASSWORD
 */
export const registerWithEmail = async (email, password, fullName) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;

  // Get ID token
  const token = await user.getIdToken();

  // Create Firestore profile
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    full_name: fullName,
    email: user.email,
    role: "student",
    university_id: null,
    department_id: null,
    level_id: null,
    onboarding_completed: false,
    created_at: serverTimestamp(),
  });

  // Save session to localStorage
  localStorage.setItem(
    "auth_session",
    JSON.stringify({
      uid: user.uid,
      email: user.email,
      token,
    })
  );

  return { user, token };
};

/**
 * LOGIN WITH EMAIL + PASSWORD
 */
export const loginWithEmail = async (email, password) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const user = cred.user;

  // Get ID token
  const token = await user.getIdToken();

  // Fetch user profile from Firestore
  const userSnap = await getDoc(doc(db, "users", user.uid));
  const userData = userSnap.data();

  // Save session to localStorage
  localStorage.setItem(
    "auth_session",
    JSON.stringify({
      uid: user.uid,
      email: user.email,
      token,
    })
  );

  return { user, token, userData };
};

/**
 * GOOGLE SIGN-IN
 */
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  const user = cred.user;

  // Get ID token
  const token = await user.getIdToken();

  // Create profile ONLY if first time
  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      full_name: user.displayName,
      email: user.email,
      role: "student",
      university_id: null,
      department_id: null,
      level_id: null,
      onboarding_completed: false,
      created_at: serverTimestamp(),
    },
    { merge: true }
  );

  // Save session to localStorage
  localStorage.setItem(
    "auth_session",
    JSON.stringify({
      uid: user.uid,
      email: user.email,
      token,
    })
  );

  return { user, token };
};

/**
 * LOGOUT
 */
export const logout = async () => {
  await signOut(auth);
  localStorage.removeItem("auth_session");
};

/**
 * GET STORED SESSION
 */
export const getStoredSession = () => {
  const session = localStorage.getItem("auth_session");
  return session ? JSON.parse(session) : null;
};
