
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import OrgLogo from '../../assets/utd-logo.png';
import './Login.css'; // You can reuse your login styles for consistency
import { FaUserTie, FaLock, FaEnvelope, FaUser, FaBuilding, FaUnlock } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseDown = () => {
    setShowPassword(true);
  };

  const handleMouseUp = () => {
    setShowPassword(false);
  };

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setShowPassword(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const form = e.target;
    const username = form.username.value;
    const password = form.password.value;
    const email = form.email.value;
    const fullName = form.fullName.value;
    const affiliation = form.affiliation.value;

    try {
      // const response = await fetch("http://localhost:5000/api/register", {
      // Registration endpoint not developed yet
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        //  const response = await fetch("https://tafsiri.creativedisturbance.org:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password, email, fullName, affiliation })
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        alert(result.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("An error occurred. Try again later.");
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <div className="login-header">
          <a href="https://utdallas.edu/" target="_blank" rel="noopener noreferrer">
            <img src={OrgLogo} alt="UTD Logo" className="logo rotate-logo" />
          </a>
        </div>
        <h1>Register</h1>
        <form className="login-form" onSubmit={handleRegister}>
          <div className="form-group">
            <input type="text" id="username" placeholder="Username" name="username" required />
            <FaUserTie className="icon" />
          </div>

          <div className="form-group">
            <input type="text" id="fullName" placeholder="Full Name" name="fullName" required />
            <FaUser className="icon" />
          </div>

          <div className="form-group">
            <input type="email" id="email" placeholder="Email Address" name="email" required />
            <FaEnvelope className="icon" />
          </div>

          <div className="form-group">
            <input type="text" id="affiliation" placeholder="Affiliation (e.g., UTD, Company Name)" name="affiliation" required />
            <FaBuilding className="icon" />
          </div>

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
              {showPassword ? <FaUnlock className="icon" /> : <FaLock className="icon" />}
              {showTooltip && (
                <div className="tooltip">
                  Press and hold to show password
                </div>
              )}
            </span>
          </div>

          <button type="submit">Register</button>

          <div className="register-link">
            <p>Already have an account? <Link to="/">Login here</Link>
            </p>
          </div>
        </form>
      </div>

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
