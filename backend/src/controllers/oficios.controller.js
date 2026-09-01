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

        // Manejo de error si intentan crear un oficio que ya existe (por tu UNIQUE)
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Ese oficio ya existe en la base de datos.' });
        }

        res.status(500).json({ error: 'Error interno al crear el oficio.' });
    }
};