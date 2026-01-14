import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Notes from "./pages/Notes";
import Upload from "./pages/Upload";
import Events from "./pages/Events";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import "./index.css";

function MobileNav() {
  return (
    <nav className="nav">
      <Link to="/">Home</Link>
      <Link to="/notes">Notes</Link>
      <Link to="/upload">Upload</Link>
      <Link to="/events">Events</Link>
      <Link to="/profile">Profile</Link>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MobileNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/events" element={<Events />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);
