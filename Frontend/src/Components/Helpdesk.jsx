import React, { useState } from 'react';
import './Helpdesk.css'; // Import the CSS file
import Swal from 'sweetalert2'; 

const Helpdesk = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    description: '',
    priority: 'medium', // Default priority
  });
  // const [result, setResult] = useState(""); // State for submission result message - will be replaced by Swal

  // IMPORTANT: Replace with your actual Web3Forms Access Key
  const WEB3FORMS_ACCESS_KEY = "eb6835eb-d0c0-4a57-8cdc-fb29696279b4";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Optional: Show a "sending" message with Swal if desired
    // Swal.fire({
    //   title: 'Sending...',
    //   text: 'Please wait while your ticket is being submitted.',
    //   allowOutsideClick: false,
    //   didOpen: () => { Swal.showLoading(); }
    // });

    const formElement = e.target;
    const web3FormData = new FormData(formElement);

    // Append fields from state if they are not directly in FormData or need transformation
    // For simple named inputs, new FormData(event.target) is usually sufficient.
    // Example: web3FormData.append("customFieldFromState", formData.someValue);

    web3FormData.append("access_key", WEB3FORMS_ACCESS_KEY);
    web3FormData.append("formName", "Helpdesk Ticket"); // Optional

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: web3FormData,
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: "Success!",
          text: "Your ticket has been submitted successfully!",
          icon: "success",
        });
        formElement.reset(); // Resets the native form fields
        // Also reset React state for controlled components
        setFormData({
          name: '',
          email: '',
          subject: '',
          description: '',
          priority: 'medium',
        });
      } else {
        console.error("Error submitting form:", data);
        Swal.fire({
          title: "Error!",
          text: data.message || "There was an error submitting your ticket. Please try again.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Network or other error:", error);
      Swal.fire({
        title: "Error!",
        text: "Could not submit the form. Please check your network connection.",
        icon: "error",
      });
    }
  };

  return (
    <div className="helpdesk-container">
      <form className="helpdesk-form" onSubmit={handleSubmit}>
        <h1>Submit a Helpdesk Ticket</h1>

        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject:</label>
          <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description of Issue:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority:</label>
          <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button type="submit" className="submit-button">Submit Ticket</button>
        {/* {result && <p className="submission-result">{result}</p>} Replaced by Swal notifications */}
      </form>
    </div>
  );
};

export default Helpdesk;
