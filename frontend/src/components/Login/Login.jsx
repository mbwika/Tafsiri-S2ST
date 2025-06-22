import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import OrgLogo from '../../assets/utd-logo.png';
import './Login.css';
import { FaUserTie, FaLock, FaUnlock } from "react-icons/fa";

// Login component definition
const Login = () => {
  const navigate = useNavigate(); // Hook for navigation after login
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

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    const form = e.target;
    const username = form.username.value;
    const password = form.password.value;

    try {
        // Determine API URL based on environment
        const API_URL =
          import.meta.env.VITE_API_URL ||
          (window.location.hostname === 'localhost'
           ? 'http://localhost:5000'
           : '/api');

        // Send login request to backend
        const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const result = await response.json();

      if (response.ok) {
        // Store token and navigate to main app if login is successful
        localStorage.setItem("token", result.token);
        navigate("/app");
      } else {
        // Show error message if login fails
        alert(result.message || "Login failed");
      }
    } catch (err) {
      // Handle network or server errors
      console.error("Login error:", err);
      alert("An error occurred. Try again later.");
    }
  };

  // Render the login form UI
  return (
    <div className="login-body">
      <div className="login-container">
        <div className="login-header">
          {/* Organization logo with link */}
          <a href="https://utdallas.edu/" target="_blank" rel="noopener noreferrer">
            <img src={OrgLogo} alt="UTD Logo" className="logo rotate-logo" />
          </a>
        </div>
        <h1>Login</h1>
        <form className="login-form" onSubmit={handleLogin}>
          {/* Username input */}
          <div className="form-group">
            <input type="text" id="username" placeholder="Username" name="username" required />
            <FaUserTie className="icon" />
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

          {/* Remember me checkbox and forgot password link */}
          <div className="remember-me">
            <input type="checkbox" id="remember-me" name="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
            <div className="forgot-password"><Link to="/register">Forgot password?</Link>
          </div>
          </div>
          <button type="submit">Login</button>

          {/* Registration link */}
          <div className="register-link">
          <p>Don't have an account? <Link to="/register">Request access here</Link></p>
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

export default Login;
