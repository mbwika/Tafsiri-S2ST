



require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg'); // or mysql2 if you're using MySQL
const e = require('express');

const app = express();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432, // default PostgreSQL port
  // port: 3306, // default MySQL port
});

app.use(cors());
app.use(express.json());

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userQuery = 'SELECT * FROM subscribers WHERE username = $1'; //  AND password_hash = $2
    // const userQuery = 'SELECT * FROM users WHERE username = ? AND password_hash = ?';
    const { rows } = await pool.query(userQuery, [username]);

    if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    // hashed password check
    // const isMatch = await bcrypt.compare(password, user.password_hash);
    // if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    // plain password check
    if (password !== user.password_hash) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(5000, () => console.log("API running on http://localhost:5000"));
