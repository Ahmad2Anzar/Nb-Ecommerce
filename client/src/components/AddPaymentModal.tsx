import React, { useState, useEffect } from "react";

interface AddPaymentModalProps {
  userId: string;
  onClose: () => void;
  fetchManagers: () => void;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ userId, onClose, fetchManagers }) => {
  const [amount, setAmount] = useState("");
  const [validity, setValidity] = useState("");
  const [ratePerDay, setRatePerDay] = useState("");
  
  // Calculate validity based on amount and rate per day
  useEffect(() => {
    if (amount && ratePerDay) {
      const calculatedValidity = parseFloat(amount) / parseFloat(ratePerDay);
      setValidity(calculatedValidity.toString());
    }
  }, [amount, ratePerDay]);

  const handleSubmit = async () => {
    try {
      const payload = {
        managerId: Number(userId), // assuming userId is a number in string format
        ratePerDay: Number(ratePerDay),
        validity: Number(validity),
      };
  
      console.log("Payload being sent:", payload);
  
      const response = await fetch("http://localhost:3000/api/admin/add_payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        console.error("Server Error:", result);
        alert("Failed to add payment: " + result?.error || "Unknown error");
      } else {
        console.log("Payment added successfully:", result);
        alert("Payment added successfully");
        if (fetchManagers) {
          fetchManagers();
        }
        onClose(); // Close the modal
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("An error occurred while sending payment");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Add Payment Details
        </h2>
        
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Recharge Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter amount"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Rate per Day</label>
          <input
            type="number"
            value={ratePerDay}
            onChange={(e) => setRatePerDay(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter rate per day"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-gray-700">Validity (Days)</label>
          <input
            type="number"
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter validity in days"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentModal;
