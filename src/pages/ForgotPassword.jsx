import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMsg("Password reset email sent. Check your inbox.");
    } catch (err) {
      console.error(err);
      setMsg("Failed to send reset email. Check the address and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-2">Reset Password</h2>
        <p className="text-sm text-slate-500 mb-4">
          Enter your account email to get a reset link.
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="w-full p-3 border rounded"
          />
          {msg && <div className="text-sm text-slate-600">{msg}</div>}

          <div className="flex gap-2 justify-between">
            <button
              type="submit"
              className="bg-slate-900 text-white px-4 py-2 rounded"
            >
              {loading ? "Sending..." : "Send Reset"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-slate-500"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
