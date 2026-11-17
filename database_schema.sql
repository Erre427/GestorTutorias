CREATE DATABASE IF NOT EXISTS tecboard;
USE tecboard;

-- Tabla de Usuarios (Alumnos, Asesores y Coordinador)
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    numero_control VARCHAR(20) UNIQUE COMMENT 'Matrícula del estudiante o empleado',
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('alumno', 'asesor', 'coordinador') NOT NULL DEFAULT 'alumno',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla del catálogo de Materias
CREATE TABLE materias (
    id_materia INT AUTO_INCREMENT PRIMARY KEY,
    nombre_materia VARCHAR(100) NOT NULL,
    area VARCHAR(50) NOT NULL
);

-- Tabla de las Ofertas de Asesorías publicadas por los asesores
CREATE TABLE oferta_asesorias (
    id_oferta INT AUTO_INCREMENT PRIMARY KEY,
    id_asesor INT NOT NULL,
    id_materia INT NOT NULL,
    dia_semana ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado') NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    cupo_maximo INT NOT NULL,
    cupo_disponible INT NOT NULL,
    salon VARCHAR(50),
    estado ENUM('Pendiente', 'Aprobada', 'Rechazada', 'Completada') DEFAULT 'Pendiente' COMMENT 'El coordinador aprueba el estado',
    FOREIGN KEY (id_asesor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_materia) REFERENCES materias(id_materia) ON DELETE CASCADE
);

-- Tabla de Solicitudes que hacen los alumnos a las ofertas
CREATE TABLE solicitudes_asesoria (
    id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
    id_alumno INT NOT NULL,
    id_oferta INT NOT NULL,
    tema_especifico TEXT NOT NULL,
    estado_solicitud ENUM('Pendiente', 'Aprobada', 'Rechazada', 'Cancelada') DEFAULT 'Pendiente',
    comentarios_respuesta TEXT COMMENT 'Motivo de rechazo u observaciones del asesor',
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_alumno) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_oferta) REFERENCES oferta_asesorias(id_oferta) ON DELETE CASCADE
);
