import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios"; // Import axios
import Swal from 'sweetalert2'; // Import SweetAlert2

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("user"); // New state for selected role
  // const [message, setMessage] = useState(""); // Can be removed if Swal handles all messages
  const navigate = useNavigate();

  const handleLogin = async () => { // Made function async
    if (email.trim() && password.trim()) {
      // You might want to add email validation here
      Swal.fire({ // Indicate loading with Swal
        title: 'Logging In...',
        text: 'Please wait.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        // API endpoint for login
        const apiUrl = `http://localhost:3000/api/auth/login`;
        // Data to be sent in the request body
        // NOTE: Standard login typically only requires email/password.
        // The user's role is usually determined by the backend AFTER successful authentication.
        // We are NOT sending the 'selectedRole' from the UI in this login request body.
        const loginData = {
          email: email,
          password: password,
        };
        const response = await axios.post(apiUrl, loginData);

        // Backend responds with a success status (e.g., 200) and user data
        // Axios throws for non-2xx responses, so we can assume response.status is 2xx here.
        // We need to ensure the response body contains the expected user data.
        if (response.data && response.data.user && response.data.user.role) {
          const actualUserRole = response.data.user.role;
          const userDetails = response.data.user; // Contains email, username, role, etc.

          if (actualUserRole === selectedRole) {
            // Roles match, proceed with login
            localStorage.setItem("user", JSON.stringify(userDetails)); // Store full user object
            setIsLoggedIn(true); // Update login state

            Swal.fire({
              title: 'Success!',
              text: `Welcome, ${userDetails.username || userDetails.email}! Logging in as ${actualUserRole}. Redirecting...`,
              icon: 'success',
              timer: 2000, // Auto close after 2 seconds
              showConfirmButton: false,
            }).then(() => {
              // Navigate based on the confirmed role
              if (actualUserRole === 'admin') {
                navigate("/admindashboard"); // Or your specific admin dashboard route
              } else {
                navigate("/crimedashboard"); // Or your specific user dashboard route
              }
            });
          } else {
            // Roles do not match
            Swal.close(); // Close the loading Swal first
            Swal.fire({
              title: 'Role Mismatch',
              text: `You are trying to log in as '${selectedRole}', but your account is registered as '${actualUserRole}'. Please select the correct role.`,
              icon: 'error',
            });
            // Do not set login state or navigate
          }
        } else {
          // Response status was 2xx, but data is not in the expected format
          Swal.close(); // Close the loading Swal first
          Swal.fire({
            title: 'Login Error',
            text: response.data?.message || "Login successful, but essential user data is missing from the server response.",
            icon: 'warning',
          });
        }
      } catch (error) {
        Swal.close(); // Ensure loading Swal is closed on error
        // Handle API errors (e.g., 401 Unauthorized, 404 Not Found, network issues)
        // error.response.data.message should come from your backend for specific errors like "Invalid credentials"
        Swal.fire({
          title: 'Login Failed!',
          text: error.response?.data?.message || "An error occurred. Please check your credentials or try again.",
          icon: 'error',
        });
      }
    } else {
      Swal.fire({
        title: 'Missing Information',
        text: "⚠️ Please enter both email and password.",
        icon: 'warning',
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Email" // Changed placeholder
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Updated to use setEmail
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="form-group"> {/* Add a div for styling if needed */}
          <label htmlFor="login-role">Login as:</label>
          <select id="login-role" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button onClick={handleLogin}>Login</button>
        {/* {message && <p className="message">{message}</p>}  Removed as Swal handles messages */}
      </div>
    </div>
  );
};

export default Login;
