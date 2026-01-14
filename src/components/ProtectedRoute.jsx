import React from "react";
import { Navigate } from "react-router-dom";

const TOKEN_KEY = "authToken";

export default function ProtectedRoute({ children }) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
  if (token) return children;
  return <Navigate to="/login" replace />;
}
