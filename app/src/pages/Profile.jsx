import React from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, profile, logout } = useAuth();
  const nav = useNavigate();

  async function handleLogout(){
    await logout();
    nav('/login');
  }

  return (
    <div className="container">
      <h2>Profile</h2>
      <div className="card">
        <div><strong>{profile?.full_name || user?.email}</strong></div>
        <div style={{fontSize:12}}>{profile?.university_id}</div>
        <div style={{marginTop:12}}>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}
