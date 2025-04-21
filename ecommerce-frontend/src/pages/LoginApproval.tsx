import { useState } from "react";

type LoginRequest = {
  id: string;
  name: string;
  username: string;
  role: string;
};

type Props = {
  loginRequests: LoginRequest[];
  fetchLoginRequests: () => void;
  onclose: () => void;
};

function LoginApproval({ loginRequests, fetchLoginRequests, onclose }: Props) {
  const [loading, setLoading] = useState(false);
  console.log(loginRequests)
  const handleApproval = async (id: string, status: "approved" | "rejected") => {
    const check = status === "approved" ? true : null;
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authorization token missing.");
        return;
      }

      const res = await fetch("api/v1/admin/approve_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, check }),
      });

      if (!res.ok) throw new Error("Update failed");

      alert(`User ${status}`);
      fetchLoginRequests();
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-black">Login Requests</h2>
        <button
          onClick={onclose}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
        >
          Close
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : loginRequests.length === 0 ? (
        <p>No login requests</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1 text-black">Name</th>
              <th className="border px-2 py-1 text-black">Username</th>
              <th className="border px-2 py-1 text-black">Role</th>
              <th className="border px-2 py-1 text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loginRequests.map((r) => (
              <tr key={r.id}>
                <td className="border px-2 py-1 text-black">{r.name}</td>
                <td className="border px-2 py-1 text-black">{r.username}</td>
                <td className="border px-2 py-1 text-black">{r.role}</td>
                <td className="border px-2 py-1 text-black">
                  <button
                    className="bg-green-500 text-black px-2 py-1 mr-2"
                    onClick={() => handleApproval(r.id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-black px-2 py-1"
                    onClick={() => handleApproval(r.id, "rejected")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LoginApproval;
