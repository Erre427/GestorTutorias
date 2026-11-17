const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Obtener todas las materias
router.get('/', async (req, res) => {
    try {
        const [materias] = await pool.query('SELECT * FROM materias ORDER BY nombre_materia ASC');
        res.json(materias);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener materias' });
    }
});

// Agregar una materia
router.post('/', async (req, res) => {
    const { nombre_materia, area } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO materias (nombre_materia, area) VALUES (?, ?)', [nombre_materia, area]);
        res.status(201).json({ id: result.insertId, message: 'Materia agregada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar materia' });
    }
});

module.exports = router;
