-- 1. extensión para generar UUIDs automáticamente
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. tabla Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rut VARCHAR(12) UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    primer_apellido VARCHAR(100) NOT NULL,
    segundo_apellido VARCHAR(100),
    genero VARCHAR(30),
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'CLIENTE' NOT NULL,
    avatar_url TEXT,
    comuna_id INT,
    villa_poblacion_id INT,
    ultima_conexion TIMESTAMP,
    instagram_url VARCHAR(255),
    facebook_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    strikes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. tabla maestra de Habilidades
CREATE TABLE IF NOT EXISTS habilidades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. tabla Intermedia (Usuarios - Habilidades)
CREATE TABLE IF NOT EXISTS usuarios_habilidades (
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    habilidad_id INT REFERENCES habilidades(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, habilidad_id)
);