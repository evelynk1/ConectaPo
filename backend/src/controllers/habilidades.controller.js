import { pool } from '../config/db.js';

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