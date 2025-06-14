import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import './signup.css'; // Import the CSS file
import Swal from 'sweetalert2';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user', // Default role
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Optional: for loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => { // Make handleSubmit async
    e.preventDefault();
    setMessage(''); // Clear previous messages
    setIsLoading(true); // Set loading state

    // Basic validation (can be expanded)
    if (!formData.username || !formData.email || !formData.password || !formData.role) {
        // Using Swal for consistency, or you can use the message state
        Swal.fire({
            title: 'Error!',
            text: 'Please fill in all fields.',
            icon: 'error',
        });
        setIsLoading(false);
        return;
    }

    try {
      // API call to your backend
      const response = await axios.post('http://localhost:3000/api/auth/signup', formData);

      // Handle successful signup
      Swal.fire({
        title: 'Success!',
        text: response.data.message || `User "${formData.username}" signed up successfully as ${formData.role}. Please login.`,
        icon: 'success',
      }).then(() => {
          navigate('/login'); // Redirect to login page after signup
      });
      // Optionally reset form if not navigating away immediately or if staying on page
      // setFormData({ username: '', email: '', password: '', role: 'user' });

    } catch (error) {
      // Handle errors from the API
      let errorMessage = 'Signup failed. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        // Use the error message from the backend if available
        errorMessage = error.response.data.message;
        if (error.response.data.errors) {
          // If there are specific validation errors, you might want to format them
          const errorDetails = Object.values(error.response.data.errors).map(err => err.message).join('\n');
          errorMessage += `\nDetails:\n${errorDetails}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your network connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Signup Error:', error.message);
      }
      
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
      });
      // Or set local message state: setMessage(errorMessage);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required disabled={isLoading} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required disabled={isLoading} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required disabled={isLoading} />
          </div>
          <div className="form-group">
            <label htmlFor="role">Sign up as:</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange} disabled={isLoading}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
          {message && !isLoading && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Signup;