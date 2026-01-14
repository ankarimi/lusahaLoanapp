import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }){
  const { loading, token } = useAuth();
  if (loading) return <div style={{padding:12}}>Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
