const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'appdb',
  password: process.env.DB_PASSWORD || 'password',
  user: 'postgres',
});

// ✅ Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// ✅ Home route
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running!' });
});

// ✅ Get all users from database
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// ✅ Create a new user
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Could not create user' });
  }
});

// ✅ Database info endpoint
app.get('/db-info', async (req, res) => {
  try {
    const result = await pool.query('SELECT version()');
    res.json({ 
      database: 'connected',
      version: result.rows[0].version
    });
  } catch (err) {
    res.status(500).json({ 
      database: 'disconnected',
      error: err.message 
    });
  }
});

// ✅ CPU burn endpoint for load testing
app.get('/burn', (req, res) => {
  const start = Date.now();
  let result = 0;
  // Heavy computation
  while (Date.now() - start < 500) {
    for(let i = 0; i < 1000000; i++) {
      result += Math.sqrt(i);
    }
  }
  res.json({ result, message: 'CPU burned!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});