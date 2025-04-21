import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    mobileNo: "",
    managerId: "",
    companyName: "",
    address: "",
  });

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const payload = {
        ...form,
        mobileNo: form.mobileNo ? parseInt(form.mobileNo) : undefined,
        managerId: form.role === "employee" ? parseInt(form.managerId) : undefined,
        companyName: form.role === "manager" ? form.companyName : undefined,
        address: form.role === "customer" ? form.address : undefined,
      };

      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error);
      alert("Signup successful");
      navigate("/login");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-400 to-blue-200 flex items-center justify-center px-4">
      <div className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Create an Account
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Join us and start your journey today!
        </p>

        <input
          type="text"
          placeholder="Full Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl shadow-sm"
        />

        <input
          type="email"
          placeholder="Email Address"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl shadow-sm"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl shadow-sm"
        />

        <input
          type="tel"
          placeholder="Mobile Number"
          onChange={(e) => setForm({ ...form, mobileNo: e.target.value })}
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl shadow-sm"
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl shadow-sm bg-white text-gray-700"
        >
          <option value="user">User</option>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="customer">Customer</option>
        </select>

        {form.role === "employee" && (
          <input
            type="number"
            placeholder="Manager ID"
            onChange={(e) => setForm({ ...form, managerId: e.target.value })}
            className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl shadow-sm"
          />
        )}

        {form.role === "manager" && (
          <input
            type="text"
            placeholder="Company Name"
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl shadow-sm"
          />
        )}

        {form.role === "customer" && (
          <input
            type="text"
            placeholder="Address"
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl shadow-sm"
          />
        )}

        <button
          onClick={handleSignup}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-lg font-semibold transition duration-200 shadow-md"
        >
          Sign Up
        </button>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 hover:underline font-medium"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}
