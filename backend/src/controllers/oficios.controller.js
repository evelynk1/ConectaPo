import { pool } from '../config/db.js';

export const crearOficio = async (req, res) => {
    try {
        const { nombre, icono_url } = req.body;

        if (!nombre) {
            return res.status(400).json({ error: 'El nombre del oficio es obligatorio.' });
        }

        const query = `
            INSERT INTO negocio.oficios (nombre, icono_url)
            VALUES ($1, $2)
            RETURNING *;
        `;

        const { rows } = await pool.query(query, [nombre, icono_url || null]);

        res.status(201).json({
            mensaje: '¡Oficio creado exitosamente!',
            oficio: rows[0]
        });
    } catch (error) {
        console.error('❌ Error al crear oficio:', error);

        if (error.code === '23505') {
            return res.status(400).json({ error: 'Ese oficio ya existe en la base de datos.' });
        }

        res.status(500).json({ error: 'Error interno al crear el oficio.' });
    }
};

export const obtenerOficios = async (req, res) => {
    try {
        const query = `
            SELECT id, nombre, icono_url 
            FROM negocio.oficios 
            ORDER BY nombre ASC;
        `;

        const { rows } = await pool.query(query);

        res.json({
            total: rows.length,
            oficios: rows
        });

    } catch (error) {
        console.error('❌ Error al obtener los oficios:', error);
        res.status(500).json({ error: 'Error interno al obtener los oficios.' });
    }
};

export const actualizarOficio = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, icono_url } = req.body;
        
        const query = `
            UPDATE negocio.oficios 
            SET 
                nombre = COALESCE($1, nombre),
                icono_url = COALESCE($2, icono_url)
            WHERE id = $3
            RETURNING id, nombre, icono_url;
        `;

        const { rows } = await pool.query(query, [nombre, icono_url, id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Oficio no encontrado.' });
        }

        res.json({
            mensaje: '¡Oficio actualizado exitosamente!',
            oficio: rows[0]
        });

    } catch (error) {
        console.error('❌ Error al actualizar el oficio:', error);

        if (error.code === '23505') {
            return res.status(400).json({ error: 'Ya existe otro oficio con ese nombre.' });
        }

        res.status(500).json({ error: 'Error interno al actualizar el oficio.' });
    }
};

export const eliminarOficio = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            DELETE FROM negocio.oficios 
            WHERE id = $1 
            RETURNING id, nombre;
        `;

        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Oficio no encontrado.' });
        }

        res.json({
            mensaje: '¡Oficio eliminado exitosamente!',
            oficio: rows[0]
        });

    } catch (error) {
        console.error('❌ Error al eliminar el oficio:', error);

        if (error.code === '23503' || error.code === '23001') {
            return res.status(400).json({ 
                error: 'No se puede eliminar este oficio porque está asociado a publicaciones existentes.' 
            });
        }

        res.status(500).json({ error: 'Error interno al eliminar el oficio.' });
    }
};