import LoginApproval from "./LoginApproval";
import ActiveUser from "./ActiveUsers";
import { useState } from "react";
import SuperAdminTable from "../components/SuperAdminTable";

export default function SuperadminDashboard() {
  const [showLoginApproval, setShowLoginApproval] = useState(false);
  const [showActiveUsers, setShowActiveUsers] = useState(false);
  const [showAdminTable, setShowAdminTable] = useState(true)

    const loginRequests = [
        { id: "1", name: "John Doe", username: "john_doe", role: "User" },
        { id: "2", name: "Jane Smith", username: "jane_smith", role: "Admin" },
        { id: "3", name: "Michael Brown", username: "michael_brown", role: "User" },
        { id: "4", name: "Emily Johnson", username: "emily_johnson", role: "User" },
        { id: "5", name: "Sarah Lee", username: "sarah_lee", role: "Admin" },
        { id: "6", name: "David King", username: "david_king", role: "User" },
        { id: "7", name: "Anna Martinez", username: "anna_martinez", role: "Admin" },
        { id: "8", name: "James White", username: "james_white", role: "User" },
        { id: "9", name: "Laura Harris", username: "laura_harris", role: "User" },
        { id: "10", name: "Chris Lewis", username: "chris_lewis", role: "Admin" },
      ];
    
      const fetchLoginRequests= () => {
        console.log("hiiii")
      }

      const handleUser = () => {
        setShowLoginApproval(true);
        setShowActiveUsers(false)
        setShowAdminTable(false)
      };

      const handleActiveUsers = () => {
        setShowActiveUsers(true);
        setShowLoginApproval(false);
        setShowAdminTable(false)
      };
    
    
  return (
    <>
   <div className="w-screen h-full bg-red-100 relative overflow-hidden p-8">
  <div className="absolute top-12 right-4 flex gap-4">
    <button className="bg-black text-white px-4 py-2 rounded shadow" onClick={handleUser}>User</button>
    <button
            className="bg-black text-white px-4 py-2 rounded shadow"
            onClick={handleActiveUsers}
          >
            Active Users
          </button>
    <button className="bg-black text-white px-4 py-2 rounded shadow">Logout</button>
  </div>
  <h1 className="p-4">Welcome Super Admin</h1>
  {showAdminTable && (<SuperAdminTable/>)}
</div>

{showLoginApproval && (
          <LoginApproval
            loginRequests={loginRequests}
            fetchLoginRequests={fetchLoginRequests}
            onclose={() => {
              setShowActiveUsers(false);
              setShowLoginApproval(false);
              setShowAdminTable(true);
            }}
          />
        )}

{showActiveUsers && (
  <ActiveUser
    onclose={() => {
      setShowActiveUsers(false);
      setShowLoginApproval(false);
      setShowAdminTable(true);
    }}
  />
)}

  </>
  
  )
}
