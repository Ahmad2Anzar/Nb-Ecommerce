import React, { useState, useEffect } from 'react';
import AddPaymentModal from './AddPaymentModal';

interface Manager {
  userId: string;
  managerName: string;
  mobileNo: number;
  companyName: string;
  validity: string;
  createdAt: string;
}

export default function SuperAdminTable() {
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [managers, setManagers] = useState<Manager[]>([]);

  // Define the fetchManagers function outside of useEffect
  const fetchManagers = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/admin/managers');
      if (!res.ok) throw new Error('Failed to fetch managers');
      const data = await res.json();
      setManagers(data);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const handleAddPaymentClick = (userId: string) => {
    setSelectedUserId(userId);
    setShowModal(true);
  };

  useEffect(() => {
    fetchManagers(); // Fetch the managers data when component mounts
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
        Client Data
      </h1>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl">
        <table className="min-w-full table-auto">
          <thead className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <tr>
              <th className="text-left px-6 py-4 text-sm uppercase tracking-wider">Company Name</th>
              <th className="text-left px-6 py-4 text-sm uppercase tracking-wider">Manager Name</th>
              <th className="text-left px-6 py-4 text-sm uppercase tracking-wider">Mobile No.</th>
              <th className="text-left px-6 py-4 text-sm uppercase tracking-wider">Date</th>
              <th className="text-left px-6 py-4 text-sm uppercase tracking-wider">Add Payment</th>
              <th className="text-left px-6 py-4 text-sm uppercase tracking-wider">Validity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {managers.map((manager) => (
              <tr key={manager.userId} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-blue-600">{manager.companyName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-blue-600">{manager.managerName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-blue-600">+91 {manager.mobileNo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-blue-600">
                  {new Date(manager.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-blue-600 font-semibold cursor-pointer">
                  <button
                    onClick={() => handleAddPaymentClick(manager.managerId)} // Use userId here
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition"
                  >
                    Add Payment
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-green-600">
                  {(() => {
                    const today = new Date();
                    const validityDate = new Date(manager.validity);
                    const diffTime = validityDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    return diffDays > 0 ? `${diffDays} day(s) left` : 'Expired';
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedUserId && (
        <AddPaymentModal
          userId={selectedUserId}
          onClose={() => {
            setShowModal(false);
            setSelectedUserId(null);
          }}
          fetchManagers={fetchManagers} 
        />
      )}
    </div>
  );
}
