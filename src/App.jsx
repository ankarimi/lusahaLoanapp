import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import Universities from "./pages/admin/Universities";
import Courses from "./pages/admin/Courses";
import AdminUsers from "./pages/admin/AdminUsers";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 12, borderBottom: "1px solid #eee" }}>
        <Link to="/">Dashboard</Link>
      </div>
      <Routes>
        <Route path="/" element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>} />
        <Route path="/universities" element={<ProtectedRoute><Universities/></ProtectedRoute>} />
        <Route path="/admin/courses" element={<ProtectedRoute><Courses/></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><AdminUsers/></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
