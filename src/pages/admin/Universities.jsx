import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

export default function Universities(){
  const [unis, setUnis] = useState([]);
  const [name, setName] = useState('');

  useEffect(()=>{
    async function load(){
      const snap = await getDocs(collection(db, 'universities'));
      setUnis(snap.docs.map(d=>({ id: d.id, ...d.data() })));
    }
    load();
  },[])

  async function create(){
    if(!name) return;
    await addDoc(collection(db,'universities'), { name, location: '', created_at: new Date() });
    setName('');
    const snap = await getDocs(collection(db, 'universities'));
    setUnis(snap.docs.map(d=>({ id: d.id, ...d.data() })));
  }

  return (
    <div style={{padding:24}}>
      <h2>Universities</h2>
      <div style={{marginBottom:12}}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="University name" />
        <button onClick={create} style={{marginLeft:8}}>Create</button>
      </div>
      {unis.map(u=> (
        <div key={u.id} style={{border:'1px solid #eee', padding:12, borderRadius:8, marginBottom:8}}>
          <strong>{u.name}</strong>
        </div>
      ))}
    </div>
  )
}
