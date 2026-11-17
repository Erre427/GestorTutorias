const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the frontend static files from the root directory
app.use(express.static(path.join(__dirname, '.')));

// Rutas de la API
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/materias', require('./routes/materias'));
app.use('/api/ofertas', require('./routes/ofertas'));
app.use('/api/solicitudes', require('./routes/solicitudes'));

// Test DB Route
const pool = require('./config/db');
app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        res.json({ status: 'ok', message: 'Database connected successfully', testQuery: rows[0].solution });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ status: 'error', message: 'Database connection failed', error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
