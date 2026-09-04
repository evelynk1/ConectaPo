import { pool } from '../config/db.js';

// ==========================================
// 1. OBTENER TODAS LAS HABILIDADES (SELECT)
// ==========================================
export const obtenerHabilidades = async (req, res) => {
    try {
        const query = 'SELECT id, nombre FROM auth.habilidades ORDER BY nombre ASC';
        const { rows } = await pool.query(query);

        res.status(200).json({
            total: rows.length,
            habilidades: rows
        });
    } catch (error) {
        console.error('❌ Error al obtener habilidades:', error);
        res.status(500).json({ error: 'Error interno al obtener las habilidades.' });
    }
};

// ==========================================
// 2. CREAR HABILIDAD (INSERT)
// ==========================================
export const crearHabilidad = async (req, res) => {
    try {
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({ error: 'El nombre de la habilidad es obligatorio' });
        }

        const query = `
            INSERT INTO auth.habilidades (nombre) 
            VALUES ($1) 
            RETURNING id, nombre;
        `;
        const resultado = await pool.query(query, [nombre]);

        res.status(201).json({
            mensaje: 'Habilidad creada con éxito',
            habilidad: resultado.rows[0]
        });
    } catch (error) {
        console.error('❌ Error al crear la habilidad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// ==========================================
// 3. ACTUALIZAR HABILIDAD (UPDATE)
// ==========================================
export const actualizarHabilidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({ error: 'El nombre de la habilidad es obligatorio' });
        }

        const query = `
            UPDATE auth.habilidades 
            SET nombre = $1 
            WHERE id = $2 
            RETURNING id, nombre;
        `;
        const resultado = await pool.query(query, [nombre, id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Habilidad no encontrada' });
        }

        res.json({
            mensaje: 'Habilidad actualizada exitosamente',
            habilidad: resultado.rows[0]
        });
    } catch (error) {
        console.error('❌ Error al actualizar la habilidad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// ==========================================
// 4. ELIMINAR HABILIDAD (DELETE)
// ==========================================
export const eliminarHabilidad = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            DELETE FROM auth.habilidades 
            WHERE id = $1 
            RETURNING id, nombre;
        `;
        const resultado = await pool.query(query, [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Habilidad no encontrada' });
        }

        res.json({
            mensaje: 'Habilidad eliminada correctamente',
            habilidad: resultado.rows[0]
        });
    } catch (error) {
        console.error('❌ Error al eliminar la habilidad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};