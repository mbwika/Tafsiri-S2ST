import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import OrgLogo from '../../assets/utd-logo.png';
import './Login.css';
import { FaUserTie, FaLock, FaUnlock } from "react-icons/fa";

const Login = () => {
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

  const handleLogin = async (e) => {
    e.preventDefault();

    const form = e.target;
    const username = form.username.value;
    const password = form.password.value;

    try {
        // const response = await fetch("http://localhost:5000/api/login", {
        const response = await fetch("https://tafsiri.creativedisturbance.org/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token);
        navigate("/app");
      } else {
        alert(result.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
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
        <h1>Login</h1>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <input type="text" id="username" placeholder="Username" name="username" required />
            <FaUserTie className="icon" />
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

          <div className="remember-me">
            <input type="checkbox" id="remember-me" name="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
            <div className="forgot-password"><Link to="/register">Forgot password?</Link>
          </div>
          </div>
          <button type="submit">Login</button>

          <div className="register-link">
          <p>Don't have an account? <Link to="/register">Request access here</Link></p>
          </div>
        </form>
      </div>

      <footer className="login-footer">
        <p className="select-label">
          © 2025 <a href="https://artscilab.utdallas.edu/">ArtSciLab</a>. The University of Texas at Dallas (UTD).
        </p>
        <p>Privacy Policy | Terms of Use</p>
      </footer>
    </div>
  );
};

export default Login;
