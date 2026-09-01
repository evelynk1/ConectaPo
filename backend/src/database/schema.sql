-- ==========================================
-- 0. DESTRUCCIÓN PREVIA (SOLO PARA DESARROLLO)
-- ==========================================
-- Al borrar los esquemas en cascada, nos echamos todas las tablas de una vez
DROP SCHEMA IF EXISTS ubicaciones CASCADE;
DROP SCHEMA IF EXISTS auth CASCADE;
DROP SCHEMA IF EXISTS negocio CASCADE;
DROP SCHEMA IF EXISTS soporte CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. ESQUEMAS
-- ==========================================
CREATE SCHEMA ubicaciones;
CREATE SCHEMA auth;
CREATE SCHEMA negocio;
CREATE SCHEMA soporte;

-- ==========================================
-- 2. SCHEMA UBICACIONES
-- ==========================================
CREATE TABLE ubicaciones.regiones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE ubicaciones.ciudades (
    id SERIAL PRIMARY KEY,
    region_id INT REFERENCES ubicaciones.regiones(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE ubicaciones.comunas (
    id SERIAL PRIMARY KEY,
    ciudad_id INT REFERENCES ubicaciones.ciudades(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE ubicaciones.villas_poblaciones (
    id SERIAL PRIMARY KEY,
    comuna_id INT REFERENCES ubicaciones.comunas(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL
);

-- ==========================================
-- 3. SCHEMA AUTH
-- ==========================================
CREATE TABLE auth.usuarios (
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
    comuna_id INT REFERENCES ubicaciones.comunas(id) ON DELETE SET NULL,
    villa_poblacion_id INT REFERENCES ubicaciones.villas_poblaciones(id) ON DELETE SET NULL,
    ultima_conexion TIMESTAMP,
    instagram_url VARCHAR(255),
    facebook_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    strikes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE auth.habilidades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE auth.usuarios_habilidades (
    usuario_id UUID REFERENCES auth.usuarios(id) ON DELETE CASCADE,
    habilidad_id INT REFERENCES auth.habilidades(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, habilidad_id)
);

-- ==========================================
-- 4. SCHEMA NEGOCIO
-- ==========================================
CREATE TABLE negocio.oficios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    icono_url VARCHAR(255)
);

CREATE TABLE negocio.publicaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES auth.usuarios(id) ON DELETE CASCADE,
    oficio_id INT REFERENCES negocio.oficios(id) ON DELETE RESTRICT,
    comuna_id INT REFERENCES ubicaciones.comunas(id) ON DELETE SET NULL,
    villa_poblacion_id INT REFERENCES ubicaciones.villas_poblaciones(id) ON DELETE SET NULL,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    precio_base INT NOT NULL, -- Siempre en peso chileno (CLP)
    anos_experiencia INT DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'ACTIVA',
    es_horario_conversable BOOLEAN DEFAULT TRUE,
    contador_vistas INT DEFAULT 0,
    foto_url_1 VARCHAR(255),
    foto_url_2 VARCHAR(255),
    foto_url_3 VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE negocio.publicaciones_habilidades (
    publicacion_id UUID REFERENCES negocio.publicaciones(id) ON DELETE CASCADE,
    habilidad_id INT REFERENCES auth.habilidades(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (publicacion_id, habilidad_id)
);


CREATE TABLE negocio.bloques_horarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    publicacion_id UUID REFERENCES negocio.publicaciones(id) ON DELETE CASCADE,
    fecha_hora_inicio TIMESTAMP NOT NULL,
    fecha_hora_fin TIMESTAMP NOT NULL,
    estado VARCHAR(20) DEFAULT 'DISPONIBLE', -- DISPONIBLE, RESERVADO, COMPLETADO
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE negocio.evaluaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    publicacion_id UUID REFERENCES negocio.publicaciones(id) ON DELETE CASCADE,
    evaluador_id UUID REFERENCES auth.usuarios(id) ON DELETE CASCADE,
    calificacion INT NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
    comentario TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 5. SCHEMA SOPORTE
-- ==========================================
CREATE TABLE soporte.tipos_ticket (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE soporte.tickets_soporte (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES auth.usuarios(id) ON DELETE CASCADE,
    tipo_ticket_id INT REFERENCES soporte.tipos_ticket(id) ON DELETE RESTRICT,
    mensaje TEXT NOT NULL,
    estado VARCHAR(20) DEFAULT 'PENDIENTE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);