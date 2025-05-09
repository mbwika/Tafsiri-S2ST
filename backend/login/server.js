



require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg'); // or mysql2 if you're using MySQL
const e = require('express');

const app = express();

// Flexible CORS setup: allow based on actual origin
const whitelist = [
  'https://tafsiri.creativedisturbance.org', // production
  'http://localhost:5173',                   // Vite dev
  'http://127.0.0.1:5173'                    // alternative localhost
];
// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432, // default PostgreSQL port
  // port: 3306, // default MySQL port
});

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

app.use(express.json());

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
     const userQuery = 'SELECT * FROM subscribers WHERE username = $1'; //  AND password_hash = $2
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
      

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));

// // NodeJS backend #server.js
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const { Pool } = require('pg');
// const { ServerRouter } = require('react-router-dom');

// const app = express();

// // Flexible CORS setup: allow based on actual origin
// const whitelist = [
//   'https://tafsiri.creativedisturbance.org', // production
//   'http://localhost:5173',                   // Vite dev
//   'http://127.0.0.1:5173'                    // alternative localhost
// ];

// // app.use(cors({
// //   origin: function (origin, callback) {
// //     if (!origin || whitelist.includes(origin)) {
// //       callback(null, true);
// //     } else {
// //       callback(new Error(`CORS blocked for origin: ${origin}`));
// //     }
// //   },
// //   credentials: true,
// //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// //   allowedHeaders: ['Content-Type', 'Authorization']
// // }));

// // CORS setup with whitelist for debugging
// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) {
//       console.log('CORS: Request without origin (likely curl or mobile app) - allowed.');
//       return callback(null, true);
//     }

//     if (whitelist.includes(origin)) {
//       console.log(`CORS: Allowed origin -> ${origin}`);
//       return callback(null, true);
//     } else {
//       console.warn(`CORS: Blocked origin -> ${origin}`);
//       return callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));


// app.use(express.json());

// // PostgreSQL connection pool
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: 5432,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
// });

// // Example route
// app.get('/', (req, res) => {
//   res.send('Server is running.');
// });

// // Start the server
// const PORT = process.env.PORT || 443;
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT} in ${process.env.NODE_ENV} mode.`);
// });
