import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for stored session on mount
  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem("authToken");
    const storedUserId = localStorage.getItem("userId");

    // Listen to Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && storedToken) {
        // User is logged in and has a valid token
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          emailVerified: firebaseUser.emailVerified,
        });
        setToken(storedToken);
      } else {
        // No user or no token - clear everything
        setUser(null);
        setToken(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Create session token (call after login/register)
  const createSession = (firebaseUser) => {
    const sessionToken = `${firebaseUser.uid}-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Store in localStorage
    localStorage.setItem("authToken", sessionToken);
    localStorage.setItem("userId", firebaseUser.uid);

    // Update state
    setUser({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      emailVerified: firebaseUser.emailVerified,
    });
    setToken(sessionToken);

    return sessionToken;
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, createSession, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
