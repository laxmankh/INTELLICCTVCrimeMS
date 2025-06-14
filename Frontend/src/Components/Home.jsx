import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
  Navigate,
  useNavigate,
  Link
} from "react-router-dom";
import CrimeDashboard from "./CrimeDashboard";
import CrimeRecords from "./CrimeRecords";
import Login from "./Login";
import crimeBg from "../assets/Images/crime.jpg"; // Assuming this path is correct
import "./HomePage.css";
import Helpdesk from "./Helpdesk";
import Signup from "./signup"; // Import the Signup component

const HomeContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login"); // Optionally navigate to login or home page after logout
  };

  return (
    <div className="home-container" style={{ backgroundImage: `url(${crimeBg})` }}>
      <nav className="navbar">
        <Link to="/" className="nav-brand">INTELLICCTVCrimeMS</Link>
        <ul>
          <li><NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>Home</NavLink></li>
          <li><NavLink to="/crimedashboard" className={({ isActive }) => isActive ? "active-link" : ""}>Crime Dashboard</NavLink></li>
          <li><NavLink to="/crimerecords" className={({ isActive }) => isActive ? "active-link" : ""}>Crime Records</NavLink></li>
          <li><NavLink to="/helpdesk" className={({ isActive }) => isActive ? "active-link" : ""}>Helpdesk</NavLink></li>
          {isLoggedIn ? (
            <li><button onClick={handleLogout} className="nav-button">Logout</button></li>
          ) : (
            <>
              <li><NavLink to="/login" className={({ isActive }) => isActive ? "active-link" : ""}>Login</NavLink></li>
              <li><NavLink to="/signup" className={({ isActive }) => isActive ? "active-link" : ""}>Signup</NavLink></li>
            </>
          )}
        </ul>
      </nav>
      
      <div className="main-content">
        <Routes>
          <Route path="/" element={<h2 className="welcome-message">CrimeSystem</h2>} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<Signup />} /> 
          <Route 
            path="/crimedashboard" 
            element={isLoggedIn ? <CrimeDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/crimerecords" 
            element={isLoggedIn ? <CrimeRecords /> : <Navigate to="/login" />} 
          />
          <Route path="/helpdesk" element={<Helpdesk />} />
        </Routes>
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <Router>
      <HomeContent />
    </Router>
  );
};

export default Home;
