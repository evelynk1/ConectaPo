import { pool } from '../config/db.js';

// ==========================================
// CREAR PUBLICACIÓN CON HABILIDADES
// ==========================================
export const crearPublicacion = async (req, res) => {
    const client = await pool.connect();
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

        await client.query('BEGIN');

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

        const { rows } = await client.query(query, values);
        const nuevaPublicacion = rows[0];

        // 2. Si vienen habilidades, en la tabla intermedia
        if (habilidades && Array.isArray(habilidades) && habilidades.length > 0) {
            for (const habilidad_id of habilidades) {
                await client.query(
                    `INSERT INTO negocio.publicaciones_habilidades (publicacion_id, habilidad_id) VALUES ($1, $2)`,
                    [nuevaPublicacion.id, habilidad_id]
                );
            }
        }

        await client.query('COMMIT');

        res.status(201).json({
            mensaje: '¡Publicación completa creada exitosamente!',
            publicacion: nuevaPublicacion,
            habilidades_asignadas: habilidades || []
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error al crear publicación:', error);
        res.status(500).json({ error: 'Error interno del servidor al crear la publicación.' });
    } finally {
        client.release();
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
// Eliminar publicación (o asegurarte de que solo el dueño pueda borrarla)
export const eliminarPublicacion = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario_id = req.usuario.id;

        // Opcional: Primero puedes borrar las relaciones de la tabla intermedia si no tienes ON DELETE CASCADE en tu BD
        await pool.query(`DELETE FROM negocio.publicaciones_habilidades WHERE publicacion_id = $1`, [id]);

        const query = `
            DELETE FROM negocio.publicaciones 
            WHERE id = $1 AND usuario_id = $2
            RETURNING id, titulo;
        `;

        const { rows } = await pool.query(query, [id, usuario_id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Publicación no encontrada o no autorizada para eliminar.' });
        }

        res.status(200).json({
            mensaje: '¡Publicación eliminada exitosamente!',
            publicacion: rows[0]
        });

    } catch (error) {
        console.error('❌ Error al eliminar publicación:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar la publicación.' });
    }
};

// ==========================================
// SUBIR FOTOS A UNA PUBLICACIÓN
// ==========================================
export const subirFotosPublicacion = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario_id = req.usuario.id;

        const checkPub = await pool.query('SELECT id FROM negocio.publicaciones WHERE id = $1 AND usuario_id = $2', [id, usuario_id]);
        if (checkPub.rows.length === 0) {
            return res.status(403).json({ error: 'Publicación no encontrada o no tienes permiso para editarla.' });
        }

        let updates = [];
        let values = [];
        let paramIndex = 1;

        if (req.files?.foto1) {
            updates.push(`foto_url_1 = $${paramIndex++}`);
            values.push(req.files.foto1[0].path);
        }
        if (req.files?.foto2) {
            updates.push(`foto_url_2 = $${paramIndex++}`);
            values.push(req.files.foto2[0].path);
        }
        if (req.files?.foto3) {
            updates.push(`foto_url_3 = $${paramIndex++}`);
            values.push(req.files.foto3[0].path);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No se subió ninguna imagen.' });
        }

        values.push(id);

        const updateQuery = `
            UPDATE negocio.publicaciones 
            SET ${updates.join(', ')} 
            WHERE id = $${paramIndex} 
            RETURNING id, titulo, foto_url_1, foto_url_2, foto_url_3;
        `;

        const { rows } = await pool.query(updateQuery, values);

        res.status(200).json({
            mensaje: '¡Fotos de la publicación actualizadas con éxito!',
            publicacion: rows[0]
        });

    } catch (error) {
        console.error('❌ Error al subir fotos de publicación:', error);
        res.status(500).json({ error: 'Error interno al guardar las fotos.' });
    }
};

export const obtenerPublicacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query(`
            SELECT p.*, o.nombre AS oficio_nombre, u.nombres AS usuario_nombre,
                   u.primer_apellido AS usuario_apellido, u.telefono AS usuario_telefono
            FROM negocio.publicaciones p
            JOIN negocio.oficios o ON o.id = p.oficio_id
            JOIN auth.usuarios u ON u.id = p.usuario_id
            WHERE p.id = $1 AND p.estado = 'ACTIVA'`, [id]);

        if (!rows.length) return res.status(404).json({ error: 'Publicación no encontrada.' });
        res.json({ publicacion: rows[0] });
    } catch (error) {
        console.error('❌ Error al obtener publicación:', error);
        res.status(500).json({ error: 'Error interno al consultar la publicación.' });
    }
};

export const obtenerMisPublicaciones = async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM negocio.publicaciones WHERE usuario_id = $1 ORDER BY created_at DESC',
            [req.usuario.id],
        );
        res.json({ total: rows.length, publicaciones: rows });
    } catch (error) {
        console.error('❌ Error al obtener publicaciones del profesional:', error);
        res.status(500).json({ error: 'Error interno al consultar las publicaciones.' });
    }
};

export const registrarVista = async (req, res) => {
    try {
        const { rows } = await pool.query(`
            UPDATE negocio.publicaciones
            SET contador_vistas = contador_vistas + 1
            WHERE id = $1 AND estado = 'ACTIVA'
            RETURNING contador_vistas`, [req.params.id]);
        if (!rows.length) return res.status(404).json({ error: 'Publicación no encontrada.' });
        res.json({ mensaje: 'Vista registrada.', contador_vistas: rows[0].contador_vistas });
    } catch (error) {
        console.error('❌ Error al registrar vista:', error);
        res.status(500).json({ error: 'Error interno al registrar la vista.' });
    }
};
