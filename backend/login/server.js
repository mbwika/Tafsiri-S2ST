// server.js// NodeJS backend for login functionality
// This file handles user authentication, including login and JWT token generation.

require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg'); // PostgreSQL client
const e = require('express');

const app = express();

// Define a whitelist of allowed origins for CORS
const whitelist = [
  'https://tafsiri.creativedisturbance.org', // production
  'http://localhost:5173',
  'http://localhost:3000',                   // Vite dev
  'http://127.0.0.1:5173'                    // alternative localhost
];

// PostgreSQL connection pool setup using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432, // default PostgreSQL port
  // port: 3306, // default MySQL port
});

// CORS middleware: only allow requests from whitelisted origins
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Parse incoming JSON requests

// Login endpoint: verifies user credentials and returns a JWT token if successful
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Query for user by username
    const userQuery = 'SELECT * FROM subscribers WHERE username = $1'  // AND password_hash = $2';
    const { rows } = await pool.query(userQuery, [username]);

    // If user not found, return error
    if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    // Password check (currently plain text, bcrypt commented out)
    // const isMatch = await bcrypt.compare(password, user.password_hash);
    // if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    if (password !== user.password_hash) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token for authenticated user
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    // Handle server or database errors
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));


