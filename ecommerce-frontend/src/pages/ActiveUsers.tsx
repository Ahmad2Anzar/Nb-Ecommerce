import React, { useState, useEffect } from "react";

interface ActiveUserData {
  id: string;
  name: string;
  username: string;
  role: string;
}

interface ActiveUserProps {
  onclose: () => void;
}

const ActiveUser = ({ onclose }: ActiveUserProps) => {
  const [activeUsers, setActiveUsers] = useState<ActiveUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [currentSelectedUserId, setCurrentSelectedUserId] = useState<string | null>(null);

  const fetchActiveUsers = async () => {
    try {
      setLoading(true);
      const dummyData = [
        { id: "u1", name: "Alice Johnson", username: "alice_j", role: "User" },
        { id: "u2", name: "Bob Smith", username: "bob_smith", role: "Admin" },
        { id: "u3", name: "Charlie Brown", username: "charlie_b", role: "User" },
        { id: "u4", name: "Diana Prince", username: "diana_p", role: "Manager" },
        { id: "u5", name: "Ethan Hunt", username: "ethan_h", role: "User" },
      ];
      setActiveUsers(dummyData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveUsers();
  }, []);

  const handleClick = (userId: string) => {
    setShowDialog(true);
    setCurrentSelectedUserId(userId);
  };

  const handleCancelLogout = () => {
    setShowDialog(false);
    setCurrentSelectedUserId(null);
  };

  const handleDeactivate = async (id: string) => {
    setShowDialog(false);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authorization token is missing.");

      const response = await fetch("api/v1/admin/deactivate_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, check: null }),
      });

      if (!response.ok) throw new Error("Failed to deactivate user.");

      fetchActiveUsers();
    } catch (error: any) {
      console.error(error.message || "Deactivation failed.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-indigo-600 text-5xl animate-spin">⏳</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-rose-600 text-xl font-medium">
        <span className="mr-2">⚠️</span> {error}
      </div>
    );
  }

  if (activeUsers.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-500 text-xl font-medium">
        <span className="mr-2">👥</span> No active users found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-gray-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
            <span className="text-indigo-600">👤</span> Active Users
          </h1>
          <button
            onClick={onclose}
            className="bg-rose-600 hover:bg-rose-700 text-white text-sm px-3 py-1.5 rounded-full shadow-sm transition-all duration-300 flex items-center gap-1.5"
          >
            <span className="text-xs">✖</span> Close
          </button>

        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeUsers.map((user) => (
            <div
  key={user.id}
  className="relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-5 w-full max-w-sm"
>
  {/* Subtle ❌ button */}
  <button
    onClick={() => handleClick(user.id)}
    className="absolute top-2 right-2 text-gray-400 hover:text-rose-600 text-xs font-bold transition-colors"
    title="Remove user"
  >
    ✕
  </button>

  {/* Header: Avatar style ✔ + Name */}
  <div className="flex items-center gap-3 mb-4">
    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm">
      ✔
    </div>
    <div>
      <h2 className="text-base font-semibold text-gray-800">{user.name}</h2>
      <p className="text-sm text-gray-500">@{user.username}</p>
    </div>
  </div>

  {/* Info section */}
  <div className="space-y-2 text-sm text-gray-600">
    <div className="flex items-center gap-2">
      <span className="text-indigo-500">📧</span>
      <span className="truncate">{user.username}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-yellow-500">🛡</span>
      <span className="capitalize">Role: {user.role}</span>
    </div>
  </div>
</div>

          ))}
        </div>

        {/* Dialog */}
        {showDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md text-center transform transition-all duration-300 scale-95 animate-pop-in">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Deactivate User?</h2>
              <p className="text-gray-600 mb-6 text-sm">Are you sure you want to deactivate this user? This action cannot be undone.</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleDeactivate(currentSelectedUserId!)}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-full transition-all duration-300 shadow-md"
                >
                  Yes, Deactivate
                </button>
                <button
                  onClick={handleCancelLogout}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-full transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveUser;