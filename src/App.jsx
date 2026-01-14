import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import Universities from "./pages/admin/Universities";
import Courses from "./pages/admin/Courses";

export default function App(){
  return (
    <BrowserRouter>
      <div style={{padding:12,borderBottom:'1px solid #eee'}}>
        <Link to="/">Dashboard</Link>
      </div>
      <Routes>
        <Route path="/" element={<AdminDashboard/>} />
        <Route path="/universities" element={<Universities/>} />
        <Route path="/admin/courses" element={<Courses/>} />
      </Routes>
    </BrowserRouter>
  );
}
