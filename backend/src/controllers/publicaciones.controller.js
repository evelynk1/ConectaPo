import { pool } from '../config/db.js';

// ==========================================
// CREAR PUBLICACIÓN CON HABILIDADES
// ==========================================
export const crearPublicacion = async (req, res) => {
    try {
        const {
            titulo,
            descripcion,
            precio_base,
            oficio_id,
            comuna_id,
            villa_poblacion_id,
            anos_experiencia,
            es_horario_conversable,
            foto_url_1,
            foto_url_2,
            foto_url_3,
            habilidades
        } = req.body;

        const usuario_id = req.usuario.id;

        if (!titulo || !descripcion || !precio_base) {
            return res.status(400).json({ error: 'El título, descripción y precio_base son obligatorios.' });
        }

        // 1. Insertamos la publicación
        const query = `
          INSERT INTO negocio.publicaciones (
            usuario_id, titulo, descripcion, precio_base, oficio_id, comuna_id, 
            villa_poblacion_id, anos_experiencia, es_horario_conversable, 
            foto_url_1, foto_url_2, foto_url_3
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          RETURNING *; 
        `;

        const values = [
            usuario_id, titulo, descripcion, precio_base,
            oficio_id || null, comuna_id || null, villa_poblacion_id || null,
            anos_experiencia || 0,
            es_horario_conversable !== undefined ? es_horario_conversable : true,
            foto_url_1 || null, foto_url_2 || null, foto_url_3 || null
        ];

        const { rows } = await pool.query(query, values);
        const nuevaPublicacion = rows[0];

        // 2. Si vienen habilidades, en la tabla intermedia
        if (habilidades && Array.isArray(habilidades) && habilidades.length > 0) {
            for (const habilidad_id of habilidades) {
                await pool.query(
                    `INSERT INTO negocio.publicaciones_habilidades (publicacion_id, habilidad_id) VALUES ($1, $2)`,
                    [nuevaPublicacion.id, habilidad_id]
                );
            }
        }

        res.status(201).json({
            mensaje: '¡Publicación completa creada exitosamente!',
            publicacion: nuevaPublicacion,
            habilidades_asignadas: habilidades || []
        });

    } catch (error) {
        console.error('❌ Error al crear publicación:', error);
        res.status(500).json({ error: 'Error interno del servidor al crear la publicación.' });
    }
};

// Obtener publicaciones con SELECT e información relacionada
export const obtenerPublicaciones = async (req, res) => {
    try {
        const query = `
            SELECT 
                p.id,
                p.titulo,
                p.descripcion,
                p.precio_base,
                p.anos_experiencia,
                p.es_horario_conversable,
                p.contador_vistas,
                p.foto_url_1,
                p.created_at,
                o.nombre AS oficio_nombre,
                o.icono_url AS oficio_icono,
                u.nombres AS usuario_nombre,
                u.primer_apellido AS usuario_apellido,
                u.telefono AS usuario_telefono,
                u.email AS usuario_email
            FROM negocio.publicaciones p
            JOIN negocio.oficios o ON p.oficio_id = o.id
            JOIN auth.usuarios u ON p.usuario_id = u.id
            WHERE p.estado = 'ACTIVA'
            ORDER BY p.created_at DESC;
        `;

        const { rows } = await pool.query(query);

        res.status(200).json({
            total: rows.length,
            publicaciones: rows
        });

    } catch (error) {
        console.error('❌ Error al obtener publicaciones:', error);
        res.status(500).json({ error: 'Error interno al consultar las publicaciones.' });
    }
};

// Actualizar publicación con COALESCE para permitir modificaciones parciales
export const actualizarPublicacion = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario_id = req.usuario.id;
        const {
            titulo,
            descripcion,
            precio_base,
            oficio_id,
            comuna_id,
            villa_poblacion_id,
            anos_experiencia,
            es_horario_conversable,
            foto_url_1,
            foto_url_2,
            foto_url_3
        } = req.body;

        const query = `
            UPDATE negocio.publicaciones 
            SET titulo = COALESCE($1, titulo),
                descripcion = COALESCE($2, descripcion),
                precio_base = COALESCE($3, precio_base),
                oficio_id = COALESCE($4, oficio_id),
                comuna_id = COALESCE($5, comuna_id),
                villa_poblacion_id = COALESCE($6, villa_poblacion_id),
                anos_experiencia = COALESCE($7, anos_experiencia),
                es_horario_conversable = COALESCE($8, es_horario_conversable),
                foto_url_1 = COALESCE($9, foto_url_1),
                foto_url_2 = COALESCE($10, foto_url_2),
                foto_url_3 = COALESCE($11, foto_url_3)
            WHERE id = $12 AND usuario_id = $13
            RETURNING *;
        `;

        const values = [
            titulo,
            descripcion,
            precio_base,
            oficio_id,
            comuna_id,
            villa_poblacion_id,
            anos_experiencia,
            es_horario_conversable,
            foto_url_1,
            foto_url_2,
            foto_url_3,
            id,
            usuario_id
        ];

        const { rows } = await pool.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Publicación no encontrada o no autorizada para actualizar.' });
        }

        res.status(200).json({
            mensaje: '¡Publicación actualizada exitosamente!',
            publicacion: rows[0]
        });

    } catch (error) {
        console.error('❌ Error al actualizar publicación:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar la publicación.' });
    }
};