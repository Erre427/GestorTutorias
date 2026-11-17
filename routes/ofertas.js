const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Obtener todas las ofertas (con detalles del asesor y materia)
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT o.*, u.nombre as asesor_nombre, m.nombre_materia 
            FROM oferta_asesorias o
            JOIN usuarios u ON o.id_asesor = u.id_usuario
            JOIN materias m ON o.id_materia = m.id_materia
            ORDER BY o.id_oferta DESC
        `;
        const [ofertas] = await pool.query(query);
        res.json(ofertas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener ofertas' });
    }
});

// Crear una nueva oferta (asesor)
router.post('/', async (req, res) => {
    const { id_asesor, id_materia, dia_semana, hora_inicio, hora_fin, cupo_maximo, salon } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO oferta_asesorias (id_asesor, id_materia, dia_semana, hora_inicio, hora_fin, cupo_maximo, cupo_disponible, salon) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id_asesor, id_materia, dia_semana, hora_inicio, hora_fin, cupo_maximo, cupo_maximo, salon || null]
        );
        res.status(201).json({ id: result.insertId, message: 'Oferta creada y en espera de aprobación' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la oferta' });
    }
});

// Cambiar estado de la oferta (Coordinador)
router.patch('/:id/estado', async (req, res) => {
    const { estado } = req.body;
    try {
        await pool.query('UPDATE oferta_asesorias SET estado = ? WHERE id_oferta = ?', [estado, req.params.id]);
        res.json({ message: 'Estado actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar estado' });
    }
});

module.exports = router;
