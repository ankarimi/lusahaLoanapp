import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Notes from "./pages/Notes";
import Upload from "./pages/Upload";
import Events from "./pages/Events";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import { AuthProvider } from "./AuthContext";
import Departments from "./pages/notes/Departments";
import Levels from "./pages/notes/Levels";
import Courses from "./pages/notes/Courses";
import CourseNotes from "./pages/notes/CourseNotes";
import ProtectedRoute from "./ProtectedRoute";
import "./index.css";
function MobileNav() {
  return (
    <nav className="nav">
      <Link to="/">Home</Link>
      <Link to="/notes">Notes</Link>
      <Link to="/upload">Upload</Link>
      <Link to="/events">Events</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MobileNav />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes: require a session token */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/departments"
          element={
            <ProtectedRoute>
              <Departments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/:departmentId/levels"
          element={
            <ProtectedRoute>
              <Levels />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/:departmentId/levels/:levelId/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/courses/:courseId/notes"
          element={
            <ProtectedRoute>
              <CourseNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
