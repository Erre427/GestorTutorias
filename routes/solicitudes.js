const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Crear una nueva solicitud (alumno)
router.post('/', async (req, res) => {
    const { id_alumno, id_oferta, tema_especifico } = req.body;
    try {
        const [ofertas] = await pool.query('SELECT cupo_disponible FROM oferta_asesorias WHERE id_oferta = ?', [id_oferta]);
        if (ofertas.length === 0) return res.status(404).json({ error: 'Oferta no encontrada' });
        if (ofertas[0].cupo_disponible <= 0) return res.status(400).json({ error: 'No hay cupo disponible' });

        const [result] = await pool.query(
            'INSERT INTO solicitudes_asesoria (id_alumno, id_oferta, tema_especifico) VALUES (?, ?, ?)',
            [id_alumno, id_oferta, tema_especifico]
        );
        res.status(201).json({ id: result.insertId, message: 'Solicitud enviada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la solicitud' });
    }
});

// Responder a una solicitud (asesor)
router.patch('/:id/responder', async (req, res) => {
    const { estado_solicitud, comentarios_respuesta } = req.body;
    const connection = await pool.getConnection(); 
    try {
        await connection.beginTransaction();

        const [solicitudes] = await connection.query('SELECT * FROM solicitudes_asesoria WHERE id_solicitud = ?', [req.params.id]);
        if (solicitudes.length === 0) throw new Error('Solicitud no encontrada');
        const solicitud = solicitudes[0];

        await connection.query(
            'UPDATE solicitudes_asesoria SET estado_solicitud = ?, comentarios_respuesta = ? WHERE id_solicitud = ?',
            [estado_solicitud, comentarios_respuesta || null, req.params.id]
        );

        if (estado_solicitud === 'Aprobada' && solicitud.estado_solicitud !== 'Aprobada') {
            await connection.query('UPDATE oferta_asesorias SET cupo_disponible = cupo_disponible - 1 WHERE id_oferta = ?', [solicitud.id_oferta]);
        } else if (estado_solicitud !== 'Aprobada' && solicitud.estado_solicitud === 'Aprobada') {
            await connection.query('UPDATE oferta_asesorias SET cupo_disponible = cupo_disponible + 1 WHERE id_oferta = ?', [solicitud.id_oferta]);
        }

        await connection.commit();
        res.json({ message: 'Solicitud respondida correctamente' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al procesar solicitud: ' + error.message });
    } finally {
        connection.release();
    }
});

// Obtener solicitudes por alumno
router.get('/alumno/:id', async (req, res) => {
    try {
        const query = `
            SELECT s.*, o.dia_semana, o.hora_inicio, o.salon, m.nombre_materia, u.nombre as asesor_nombre
            FROM solicitudes_asesoria s
            JOIN oferta_asesorias o ON s.id_oferta = o.id_oferta
            JOIN materias m ON o.id_materia = m.id_materia
            JOIN usuarios u ON o.id_asesor = u.id_usuario
            WHERE s.id_alumno = ?
            ORDER BY s.fecha_solicitud DESC
        `;
        const [solicitudes] = await pool.query(query, [req.params.id]);
        res.json(solicitudes);
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
});

module.exports = router;
