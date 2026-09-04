import { pool } from '../config/db.js';

// ==========================================
// 1. CREAR EVALUACIÓN (Mutua)
// ==========================================
export const crearEvaluacion = async (req, res) => {
    try {
        const { bloque_horario_id, calificacion, comentario } = req.body;
        const evaluador_id = req.usuario.id;

        if (!calificacion || calificacion < 1 || calificacion > 5) {
            return res.status(400).json({ error: 'La calificación debe ser un número entre 1 y 5.' });
        }

        // 1. Traer los datos del trabajo (bloque) y la publicación
        const queryTrabajo = `
            SELECT bh.estado, bh.cliente_id, bh.publicacion_id, p.usuario_id AS maestro_id
            FROM negocio.bloques_horarios bh
            JOIN negocio.publicaciones p ON bh.publicacion_id = p.id
            WHERE bh.id = $1
        `;
        const { rows } = await pool.query(queryTrabajo, [bloque_horario_id]);

        if (rows.length === 0) return res.status(404).json({ error: 'Trabajo no encontrado.' });
        const trabajo = rows[0];

        // 2. Validar que el trabajo esté completado
        if (trabajo.estado !== 'COMPLETADO') {
            return res.status(400).json({ error: 'Solo puedes evaluar trabajos que ya fueron completados.' });
        }

        // 3. Determinar quién evalúa a quién
        let evaluado_id = null;
        if (evaluador_id === trabajo.cliente_id) {
            evaluado_id = trabajo.maestro_id; // El cliente evalúa al maestro
        } else if (evaluador_id === trabajo.maestro_id) {
            evaluado_id = trabajo.cliente_id; // El maestro evalúa al cliente
        } else {
            return res.status(403).json({ error: 'No participaste en este trabajo, no puedes evaluarlo.' });
        }

        // 4. Guardar la evaluación
        const insertQuery = `
            INSERT INTO negocio.evaluaciones (bloque_horario_id, publicacion_id, evaluador_id, evaluado_id, calificacion, comentario)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const result = await pool.query(insertQuery, [
            bloque_horario_id, trabajo.publicacion_id, evaluador_id, evaluado_id, calificacion, comentario
        ]);

        res.status(201).json({
            mensaje: '¡Evaluación registrada con éxito!',
            evaluacion: result.rows[0]
        });

    } catch (error) {
        // Capturar el error de la regla UNIQUE de la base de datos
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Ya evaluaste este trabajo, no puedes volver a hacerlo.' });
        }
        console.error('❌ Error al crear evaluación:', error);
        res.status(500).json({ error: 'Error interno al guardar la evaluación.' });
    }
};

// ==========================================
// 2. OBTENER EVALUACIONES DE UNA PUBLICACIÓN
// ==========================================
export const obtenerEvaluacionesPorPublicacion = async (req, res) => {
    try {
        const { publicacion_id } = req.params;

        // Cambiamos u.apellidos por u.primer_apellido
        const queryLista = `
            SELECT e.id, e.calificacion, e.comentario, e.created_at, u.nombres, u.primer_apellido
            FROM negocio.evaluaciones e
            JOIN auth.usuarios u ON e.evaluador_id = u.id
            JOIN negocio.publicaciones p ON e.publicacion_id = p.id
            WHERE e.publicacion_id = $1 AND e.evaluado_id = p.usuario_id
            ORDER BY e.created_at DESC;
        `;
        const resultLista = await pool.query(queryLista, [publicacion_id]);

        const queryResumen = `
            SELECT COUNT(*) as total_evaluaciones, ROUND(AVG(calificacion), 1) as promedio
            FROM negocio.evaluaciones e
            JOIN negocio.publicaciones p ON e.publicacion_id = p.id
            WHERE e.publicacion_id = $1 AND e.evaluado_id = p.usuario_id;
        `;
        const resultResumen = await pool.query(queryResumen, [publicacion_id]);

        res.status(200).json({
            resumen: {
                total: parseInt(resultResumen.rows[0].total_evaluaciones),
                promedio: parseFloat(resultResumen.rows[0].promedio) || 0
            },
            evaluaciones: resultLista.rows
        });

    } catch (error) {
        console.error('❌ Error al obtener evaluaciones:', error);
        res.status(500).json({ error: 'Error interno al obtener las evaluaciones.' });
    }
};