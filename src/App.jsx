import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import Universities from "./pages/admin/Universities";
import Courses from "./pages/admin/Courses";
import AdminUsers from "./pages/admin/AdminUsers";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
        <Link to="/">Dashboard</Link>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/universities"
          element={
            <AdminRoute>
              <Universities />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <AdminRoute>
              <Courses />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
