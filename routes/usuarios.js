const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Registro de usuario
router.post('/registro', async (req, res) => {
    const { numero_control, nombre, correo, password, rol } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO usuarios (numero_control, nombre, correo, password, rol) VALUES (?, ?, ?, ?, ?)',
            [numero_control || null, nombre, correo, password, rol || 'alumno']
        );
        res.status(201).json({ id: result.insertId, message: 'Usuario registrado exitosamente' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'El correo o número de control ya está registrado' });
        } else {
            console.error('Error en registro:', error);
            res.status(500).json({ error: 'Error del servidor al registrar usuario' });
        }
    }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
    const { correo, password } = req.body;
    try {
        const [users] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        const user = users[0];
        
        // NOTA: Para producción, es importante agregar bcrypt para encriptar/desencriptar la contraseña
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        
        // Retornamos la info del usuario sin la contraseña
        const { password: userPassword, ...userData } = user;
        res.json({ message: 'Login exitoso', user: userData });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error del servidor durante el inicio de sesión' });
    }
});

// Obtener información de un usuario
router.get('/:id', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id_usuario, numero_control, nombre, correo, rol FROM usuarios WHERE id_usuario = ?', [req.params.id]);
        if (users.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
});

module.exports = router;
