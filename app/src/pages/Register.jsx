import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Register(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [fullName,setFullName] = useState('');
  const [university,setUniversity] = useState('');
  const [status,setStatus] = useState('');
  const { register } = useAuth();
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    setStatus('Creating account...');
    try{
      await register({ email, password, full_name: fullName, university_id: university });
      nav('/');
    }catch(err){
      console.error(err);
      setStatus('Registration failed');
    }
  }

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={submit} className="card">
        <label>Full name<input value={fullName} onChange={e=>setFullName(e.target.value)} /></label>
        <label>University ID<input value={university} onChange={e=>setUniversity(e.target.value)} placeholder="university id (for now enter name)"/></label>
        <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} /></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label>
        <button type="submit">Create account</button>
      </form>
      <div style={{marginTop:12}}>{status}</div>
    </div>
  )
}
