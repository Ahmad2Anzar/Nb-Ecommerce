import React, { useState, useEffect } from "react";

// Define the interface for Active User Data
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

      // Simulate API call with dummy data
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin text-blue-500" style={{ fontSize: "48px" }}>&#8987;</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <div style={{ marginRight: "8px" }}>⚠️</div>
        <p>{error}</p>
      </div>
    );
  }

  if (activeUsers.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        <div style={{ marginRight: "8px" }}>👤</div>
        <p>No active users found</p>
      </div>
    );
  }

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
      if (!token) {
        throw new Error("Authorization token is missing.");
      }

      const response = await fetch("api/v1/admin/deactivate_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, check: null }),
      });
      if (!response.ok) {
        throw new Error("Failed to deactivate user.");
      }
      fetchActiveUsers();
    } catch (error: any) {
      console.error(error.message || "Something went wrong while deactivating user.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div style={{ marginRight: "8px", color: "#3B82F6", fontSize: "36px" }}>👤</div>
            <h1 className="text-3xl font-bold text-gray-800">Active Users</h1>
          </div>
          <button
            onClick={onclose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            X
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeUsers.map((user) => (
            <div
              key={user.id}
              className="relative bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border-l-4 border-blue-500"
            >
              <div className="flex items-center mb-4">
                <div style={{ marginRight: "8px", color: "#3B82F6" }}>✔️</div>
                <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
              </div>

              <button onClick={() => handleClick(user.id)} className="absolute top-4 right-2 text-red-500 hover:text-red-700 text-xs">
                ❌
              </button>

              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <div style={{ marginRight: "8px", color: "#9CA3AF" }}>📧</div>
                  <span>{user.username}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <div style={{ marginRight: "8px", color: "#9CA3AF" }}>👤</div>
                  <span className="capitalize">Role: {user.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Confirm Deactivate</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to Deactivate?</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleDeactivate(currentSelectedUserId!)}
                  className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={handleCancelLogout}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors"
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
