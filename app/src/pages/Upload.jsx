import React, { useState } from "react";
import { uploadImage } from "../../src/utils/uploadImage";
import { db, auth } from "../../src/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return setStatus("Pick a file first");
    setStatus("Uploading...");
    try {
      const userId = (auth.currentUser && auth.currentUser.uid) || "anonymous";
      const url = await uploadImage(file, userId, "note");

      await addDoc(collection(db, "notes"), {
        title,
        file_url: url,
        uploader_user_id: userId,
        status: "pending",
        created_at: serverTimestamp()
      });

      setStatus("Uploaded — pending approval");
      setTitle("");
      setFile(null);
    } catch (err) {
      console.error(err);
      setStatus("Upload failed");
    }
  }

  return (
    <div className="container">
      <h2>Upload Note</h2>
      <form onSubmit={handleSubmit} className="card">
        <label>
          Title
          <input value={title} onChange={e => setTitle(e.target.value)} />
        </label>
        <label>
          File
          <input type="file" onChange={e => setFile(e.target.files[0])} />
        </label>
        <button type="submit">Upload</button>
      </form>
      <div style={{ marginTop: 12 }}>{status}</div>
    </div>
  );
}
