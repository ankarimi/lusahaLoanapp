import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setStatus("Signing in...");
    try {
      await login({ email, password });
      nav("/");
    } catch (err) {
      console.error(err);
      setStatus("Login failed");
    }
  }

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={submit} className="card">
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Sign in</button>
      </form>
      <div style={{ marginTop: 12 }}>{status}</div>
    </div>
  );
}
