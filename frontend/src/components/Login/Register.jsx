import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import OrgLogo from '../../assets/utd-logo.png';
import './Login.css';
import { FaUserTie, FaLock, FaEnvelope, FaUser, FaBuilding, FaUnlock } from "react-icons/fa";

// Register component definition
const Register = () => {
  const navigate = useNavigate(); // Hook for navigation after registration
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showTooltip, setShowTooltip] = useState(false);   // State to show/hide tooltip for password

  // Show password when mouse is held down on the icon
  const handleMouseDown = () => {
    setShowPassword(true);
  };

  // Hide password when mouse is released
  const handleMouseUp = () => {
    setShowPassword(false);
  };

  // Show tooltip when mouse enters the icon
  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  // Hide tooltip and password when mouse leaves the icon
  const handleMouseLeave = () => {
    setShowTooltip(false);
    setShowPassword(false);
  };

  // Handle registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    // Get form values
    const form = e.target;
    const username = form.username.value;
    const password = form.password.value;
    const email = form.email.value;
    const fullName = form.fullName.value;
    const affiliation = form.affiliation.value;

    try {
      // Send registration request to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password, email, fullName, affiliation })
      });

      const result = await response.json();

      if (response.ok) {
        // Show success message and navigate to login page
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        // Show error message if registration fails
        alert(result.message || "Registration failed");
      }
    } catch (err) {
      // Handle network or server errors
      console.error("Registration error:", err);
      alert("An error occurred. Try again later.");
    }
  };

  // Render the registration form UI
  return (
    <div className="login-body">
      <div className="login-container">
        <div className="login-header">
          {/* Organization logo with link */}
          <a href="https://utdallas.edu/" target="_blank" rel="noopener noreferrer">
            <img src={OrgLogo} alt="UTD Logo" className="logo rotate-logo" />
          </a>
        </div>
        <h1>Register</h1>
        <form className="login-form" onSubmit={handleRegister}>
          {/* Username input */}
          <div className="form-group">
            <input type="text" id="username" placeholder="Username" name="username" required />
            <FaUserTie className="icon" />
          </div>

          {/* Full Name input */}
          <div className="form-group">
            <input type="text" id="fullName" placeholder="Full Name" name="fullName" required />
            <FaUser className="icon" />
          </div>

          {/* Email input */}
          <div className="form-group">
            <input type="email" id="email" placeholder="Email Address" name="email" required />
            <FaEnvelope className="icon" />
          </div>

          {/* Affiliation input */}
          <div className="form-group">
            <input type="text" id="affiliation" placeholder="Affiliation (e.g., UTD, Company Name)" name="affiliation" required />
            <FaBuilding className="icon" />
          </div>

          {/* Password input with show/hide functionality */}
          <div className="form-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              name="password"
              required
            />
            <span
              className="password-toggle"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={handleMouseEnter}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              {/* Toggle lock/unlock icon */}
              {showPassword ? <FaUnlock className="icon" /> : <FaLock className="icon" />}
              {/* Tooltip for password visibility */}
              {showTooltip && (
                <div className="tooltip">
                  Press and hold to show password
                </div>
              )}
            </span>
          </div>

          {/* Submit button */}
          <button type="submit">Register</button>

          {/* Login link for existing users */}
          <div className="register-link">
            <p>Already have an account? <Link to="/">Login here</Link>
            </p>
          </div>
        </form>
      </div>

      {/* Footer with copyright */}
      <footer className="login-footer">
        <p className="select-label">
          © 2025 <a href="https://artscilab.utdallas.edu/">ArtSciLab</a>. The University of Texas at Dallas (UTD).
        </p>
        {/* <p>Privacy Policy | Terms of Use</p> */}
      </footer>
    </div>
  );
};

export default Register;
