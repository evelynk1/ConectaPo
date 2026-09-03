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

// ==========================================
// OBTENER PUBLICACIONES (VITRINEO CON HABILIDADES)
// ==========================================
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
                u.email AS usuario_email,
                -- Agrupamos las habilidades en un arreglo JSON
                COALESCE(
                    json_agg(
                        json_build_object('id', h.id, 'nombre', h.nombre)
                    ) FILTER (WHERE h.id IS NOT NULL), '[]'
                ) AS habilidades
            FROM negocio.publicaciones p
            LEFT JOIN negocio.oficios o ON p.oficio_id = o.id
            JOIN auth.usuarios u ON p.usuario_id = u.id
            LEFT JOIN negocio.publicaciones_habilidades ph ON p.id = ph.publicacion_id
            LEFT JOIN auth.habilidades h ON ph.habilidad_id = h.id
            WHERE p.estado = 'ACTIVA'
            GROUP BY p.id, o.id, u.id
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

// ==========================================
// ACTUALIZAR PUBLICACIÓN Y SUS HABILIDADES
// ==========================================
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
            anos_experiencia,
            es_horario_conversable,
            estado,
            habilidades
        } = req.body;

        // 1. Verificar que la publicación pertenezca al usuario (o sea admin)
        const checkQuery = `SELECT * FROM negocio.publicaciones WHERE id = $1`;
        const checkResult = await pool.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Publicación no encontrada.' });
        }

        // 2. Actualizar los datos principales de la publicación
        const updateQuery = `
            UPDATE negocio.publicaciones 
            SET 
                titulo = COALESCE($1, titulo),
                descripcion = COALESCE($2, descripcion),
                precio_base = COALESCE($3, precio_base),
                oficio_id = COALESCE($4, oficio_id),
                comuna_id = COALESCE($5, comuna_id),
                anos_experiencia = COALESCE($6, anos_experiencia),
                es_horario_conversable = COALESCE($7, es_horario_conversable),
                estado = COALESCE($8, estado)
            WHERE id = $9
            RETURNING *;
        `;

        const values = [
            titulo || null,
            descripcion || null,
            precio_base || null,
            oficio_id || null,
            comuna_id || null,
            anos_experiencia !== undefined ? anos_experiencia : null,
            es_horario_conversable !== undefined ? es_horario_conversable : null,
            estado || null,
            id
        ];

        const { rows } = await pool.query(updateQuery, values);
        const publicacionActualizada = rows[0];

        // 3. Si mandaron habilidades, actualizamos la tabla intermedia (estrategia: limpiar y reinsertar)
        if (habilidades && Array.isArray(habilidades)) {
            await pool.query(`DELETE FROM negocio.publicaciones_habilidades WHERE publicacion_id = $1`, [id]);

            for (const habilidad_id of habilidades) {
                await pool.query(
                    `INSERT INTO negocio.publicaciones_habilidades (publicacion_id, habilidad_id) VALUES ($1, $2)`,
                    [id, habilidad_id]
                );
            }
        }

        res.status(200).json({
            mensaje: '¡Publicación actualizada exitosamente!',
            publicacion: publicacionActualizada,
            habilidades_actualizadas: habilidades || []
        });

    } catch (error) {
        console.error('❌ Error al actualizar publicación:', error);
        res.status(500).json({ error: 'Error interno al actualizar la publicación.' });
    }
};