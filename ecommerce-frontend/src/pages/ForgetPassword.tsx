import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error);
      alert("Password reset successful");
      navigate("/login");
    } catch {
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 flex items-center justify-center px-4">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Reset Password</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Enter your email and a new password to reset your account.
        </p>

        <input
          type="email"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={handleReset}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-lg font-semibold transition duration-200 shadow-md"
        >
          Reset Password
        </button>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Remembered your password? </span>
          <button
            onClick={() => navigate("/login")}
            className="text-purple-700 hover:underline font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
