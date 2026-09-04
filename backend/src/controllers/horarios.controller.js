import { pool } from '../config/db.js';

// ==========================================
// 1. OBTENER HORARIOS DE UNA PUBLICACIÓN
// ==========================================
export const obtenerHorariosPorPublicacion = async (req, res) => {
    try {
        const { publicacion_id } = req.params;

        const query = `
            SELECT id, fecha_hora_inicio, fecha_hora_fin, estado 
            FROM negocio.bloques_horarios 
            WHERE publicacion_id = $1 
            ORDER BY fecha_hora_inicio ASC;
        `;
        const { rows } = await pool.query(query, [publicacion_id]);

        res.status(200).json({
            total: rows.length,
            bloques: rows
        });
    } catch (error) {
        console.error('❌ Error al obtener horarios:', error);
        res.status(500).json({ error: 'Error interno al obtener los horarios.' });
    }
};

// ==========================================
// 2. GUARDAR HORARIOS MASIVOS (Desde la memoria del frontend)
// ==========================================
export const guardarHorariosMasivos = async (req, res) => {
    // Usamos el cliente para poder hacer transacciones (ROLLBACK si algo falla)
    const client = await pool.connect();

    try {
        const { publicacion_id } = req.params;
        const { bloques } = req.body; // Array de objetos { fecha_hora_inicio, fecha_hora_fin }
        const usuario_id = req.usuario.id;

        // 1. Validar que la publicación le pertenezca al usuario que está guardando
        const checkPub = await client.query('SELECT id FROM negocio.publicaciones WHERE id = $1 AND usuario_id = $2', [publicacion_id, usuario_id]);
        if (checkPub.rows.length === 0) {
            return res.status(403).json({ error: 'No tienes permiso para modificar esta publicación o no existe.' });
        }

        if (!bloques || bloques.length === 0) {
            return res.status(400).json({ error: 'No se enviaron bloques para guardar.' });
        }

        await client.query('BEGIN'); // Iniciamos la transacción

        // 2. Verificar choques de horarios uno por uno
        for (const bloque of bloques) {
            const checkChoque = await client.query(`
                SELECT fecha_hora_inicio 
                FROM negocio.bloques_horarios 
                WHERE publicacion_id = $1 
                AND (
                    (fecha_hora_inicio <= $2 AND fecha_hora_fin > $2) OR 
                    (fecha_hora_inicio < $3 AND fecha_hora_fin >= $3) OR
                    (fecha_hora_inicio >= $2 AND fecha_hora_fin <= $3)
                ) LIMIT 1;
            `, [publicacion_id, bloque.fecha_hora_inicio, bloque.fecha_hora_fin]);

            if (checkChoque.rows.length > 0) {
                // Si hay choque, cancelamos todo y armamos tu mensaje personalizado
                await client.query('ROLLBACK');
                
                // Formateamos la fecha a DD/MM/YYYY HH:MM (Hora local)
                const fechaChoque = new Date(checkChoque.rows[0].fecha_hora_inicio);
                const fechaFormateada = fechaChoque.toLocaleDateString('es-CL') + ' ' + 
                                        fechaChoque.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

                return res.status(400).json({ 
                    error: `Ya tienes horarios generados para la fecha ${fechaFormateada}` 
                });
            }
        }

        // 3. Si pasamos la prueba de choques, insertamos todos los bloques
        const insertQuery = `
            INSERT INTO negocio.bloques_horarios (publicacion_id, fecha_hora_inicio, fecha_hora_fin) 
            VALUES ($1, $2, $3) RETURNING id;
        `;

        const bloquesInsertados = [];
        for (const bloque of bloques) {
            const { rows } = await client.query(insertQuery, [
                publicacion_id, 
                bloque.fecha_hora_inicio, 
                bloque.fecha_hora_fin
            ]);
            bloquesInsertados.push(rows[0].id);
        }

        await client.query('COMMIT'); // Guardamos todo de forma segura

        res.status(201).json({
            mensaje: '¡Horarios guardados exitosamente!',
            total_guardados: bloquesInsertados.length
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error al guardar horarios masivos:', error);
        res.status(500).json({ error: 'Error interno al guardar los horarios.' });
    } finally {
        client.release(); // Soltamos la conexión
    }
};

// ==========================================
// 3. ELIMINAR UN BLOQUE (Por si lo borra días después de haberlo guardado)
// ==========================================
export const eliminarBloqueHorario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario_id = req.usuario.id;

        // Verificamos que el bloque exista, sea de la publicación del usuario y NO esté reservado
        const checkQuery = `
            SELECT bh.estado 
            FROM negocio.bloques_horarios bh
            JOIN negocio.publicaciones p ON bh.publicacion_id = p.id
            WHERE bh.id = $1 AND p.usuario_id = $2;
        `;
        const checkResult = await pool.query(checkQuery, [id, usuario_id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Bloque no encontrado o no tienes permisos.' });
        }

        if (checkResult.rows[0].estado === 'RESERVADO') {
            return res.status(400).json({ error: 'No puedes eliminar un bloque que ya ha sido reservado por un cliente.' });
        }

        await pool.query('DELETE FROM negocio.bloques_horarios WHERE id = $1', [id]);

        res.status(200).json({ mensaje: 'Bloque eliminado correctamente.' });

    } catch (error) {
        console.error('❌ Error al eliminar bloque:', error);
        res.status(500).json({ error: 'Error interno al eliminar el bloque.' });
    }
};

// ==========================================
// 4. CLIENTE: RESERVAR UN BLOQUE (Botón WhatsApp)
// ==========================================
export const reservarBloque = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario_id_cliente = req.usuario.id; // Obtenemos el ID del cliente que presiona el botón

        const checkQuery = `SELECT estado, fecha_hora_inicio FROM negocio.bloques_horarios WHERE id = $1`;
        const { rows } = await pool.query(checkQuery, [id]);

        if (rows.length === 0) return res.status(404).json({ error: 'Bloque horario no encontrado.' });
        
        const bloque = rows[0];

        if (bloque.estado !== 'DISPONIBLE') return res.status(400).json({ error: 'Este bloque ya no está disponible.' });
        if (new Date(bloque.fecha_hora_inicio) <= new Date()) return res.status(400).json({ error: 'No puedes reservar un bloque del pasado.' });

        // AHORA GUARDAMOS AL CLIENTE TAMBIÉN
        const updateQuery = `
            UPDATE negocio.bloques_horarios 
            SET estado = 'RESERVADO', cliente_id = $2 
            WHERE id = $1 
            RETURNING *;
        `;
        const result = await pool.query(updateQuery, [id, usuario_id_cliente]);

        res.status(200).json({ mensaje: '¡Bloque reservado exitosamente!', bloque: result.rows[0] });

    } catch (error) {
        console.error('❌ Error al reservar bloque:', error);
        res.status(500).json({ error: 'Error interno al reservar el bloque.' });
    }
};

// ==========================================
// 5. MAESTRO: CAMBIAR ESTADO MANUALMENTE (Toggle)
// ==========================================
export const cambiarEstadoBloque = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body; // DISPONIBLE, RESERVADO, COMPLETADO
        const usuario_id = req.usuario.id;

        // Validamos que envíe un estado permitido
        const estadosValidos = ['DISPONIBLE', 'RESERVADO', 'COMPLETADO'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ error: 'Estado no válido.' });
        }

        // Verificamos que el bloque sea de una publicación que le pertenece a este usuario
        const checkQuery = `
            SELECT bh.id 
            FROM negocio.bloques_horarios bh
            JOIN negocio.publicaciones p ON bh.publicacion_id = p.id
            WHERE bh.id = $1 AND p.usuario_id = $2;
        `;
        const checkResult = await pool.query(checkQuery, [id, usuario_id]);

        if (checkResult.rows.length === 0) {
            return res.status(403).json({ error: 'No tienes permiso para modificar este bloque.' });
        }

        // Actualizamos el estado
        const updateQuery = `
            UPDATE negocio.bloques_horarios 
            SET estado = $1 
            WHERE id = $2 
            RETURNING *;
        `;
        const { rows } = await pool.query(updateQuery, [estado, id]);

        res.status(200).json({
            mensaje: `Bloque actualizado a ${estado}.`,
            bloque: rows[0]
        });

    } catch (error) {
        console.error('❌ Error al cambiar estado del bloque:', error);
        res.status(500).json({ error: 'Error interno al cambiar el estado.' });
    }
};