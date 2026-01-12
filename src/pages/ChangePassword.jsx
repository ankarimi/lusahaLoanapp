import { useState } from "react";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const user = auth.currentUser;
      const cred = EmailAuthProvider.credential(user.email, currentPwd);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPwd);
      setMsg("Password updated successfully.");
      setTimeout(() => navigate("/app/profile"), 1200);
    } catch (err) {
      console.error(err);
      setMsg("Failed to update password. Check your current password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-2">Change Password</h2>
        <p className="text-sm text-slate-500 mb-4">
          Enter your current password and a new secure password.
        </p>

        <form onSubmit={handleChange} className="space-y-4">
          <input
            type="password"
            value={currentPwd}
            onChange={(e) => setCurrentPwd(e.target.value)}
            placeholder="Current password"
            required
            className="w-full p-3 border rounded"
          />
          <input
            type="password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            placeholder="New password"
            required
            className="w-full p-3 border rounded"
          />

          {msg && <div className="text-sm text-slate-600">{msg}</div>}

          <div className="flex gap-2 justify-between">
            <button
              type="submit"
              className="bg-slate-900 text-white px-4 py-2 rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-slate-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
