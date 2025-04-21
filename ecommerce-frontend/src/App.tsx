import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import AddProduct from './pages/AddProduct';
import Login from './pages/login';
import Signup from './pages/SIgnUp';
import ForgotPassword from './pages/ForgetPassword';
import SuperadminDashboard from './pages/SuperadminDashboard';
import LoginApproval from './pages/LoginApproval';

function App() {
  return (
    <Router>
      <nav className=" w-full flex gap-4 p-4 bg-blue-100">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/addProduct">Add Product</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/forgot-password">Forgot Password</Link>
        <Link to="/superadmin-dashboard">Super Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/superadmin-dashboard" element= {<SuperadminDashboard/>}/>
      </Routes>
    </Router>
  );
}

export default App;
