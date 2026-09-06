import { pool } from '../config/db.js';

export const crearTicket = async (req, res) => {
    try {
        const { asunto, descripcion, tipo_ticket_id, mensaje } = req.body;
        const usuario_id = req.usuario.id; // Viene del token gracias al middleware verificarToken
        const asuntoFinal = asunto || (tipo_ticket_id ? `Ticket tipo ${tipo_ticket_id}` : null);
        const descripcionFinal = descripcion || mensaje;

        if (!asuntoFinal || !descripcionFinal) {
            return res.status(400).json({ error: 'El asunto y la descripción son obligatorios para el ticket.' });
        }

        const query = `
            INSERT INTO soporte.tickets (usuario_id, asunto, descripcion, estado)
            VALUES ($1, $2, $3, 'ABIERTO')
            RETURNING *;
        `;

        const { rows } = await pool.query(query, [usuario_id, asuntoFinal, descripcionFinal]);

        res.status(201).json({
            mensaje: '¡Ticket de soporte creado exitosamente!',
            ticket: rows[0],
            ticket_id: rows[0].id
        });

    } catch (error) {
        console.error('❌ Error al crear el ticket:', error);
        res.status(500).json({ error: 'Error interno al crear el ticket.' });
    }
};

export const obtenerTickets = async (req, res) => {
    try {
        // ==========================================
        // CONSULTA DE TICKETS (SELECT)
        // Trae todos los tickets de soporte ordenados
        // del más reciente al más antiguo, combinándolos
        // con la información del usuario que los creó.
        // ==========================================
        const query = `
            SELECT t.id, t.asunto, t.descripcion, t.estado, t.created_at, 
                   u.nombres, u.email 
            FROM soporte.tickets t
            JOIN auth.usuarios u ON t.usuario_id = u.id
            ORDER BY t.created_at DESC;
        `;

        const { rows } = await pool.query(query);

        res.json({
            total: rows.length,
            tickets: rows
        });

    } catch (error) {
        console.error('❌ Error al obtener los tickets:', error);
        res.status(500).json({ error: 'Error interno al obtener los tickets.' });
    }
};

// ==========================================
// ACTUALIZAR TICKET CON COALESCE (UPDATE)
// Permite modificar de forma parcial el asunto,
// la descripción o el estado de un ticket.
// ==========================================
export const actualizarTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { asunto, descripcion, estado } = req.body;

        const query = `
            UPDATE soporte.tickets 
            SET asunto = COALESCE($1, asunto),
                descripcion = COALESCE($2, descripcion),
                estado = COALESCE($3, estado)
            WHERE id = $4
            RETURNING *;
        `;

        const values = [asunto, descripcion, estado, id];
        const { rows } = await pool.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Ticket de soporte no encontrado.' });
        }

        res.status(200).json({
            mensaje: '¡Ticket actualizado exitosamente!',
            ticket: rows[0]
        });

    } catch (error) {
        console.error('❌ Error al actualizar el ticket:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar el ticket.' });
    }
};
// ==========================================
// ELIMINAR TICKET (DELETE)
// ==========================================
export const eliminarTicket = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            DELETE FROM soporte.tickets 
            WHERE id = $1 
            RETURNING id, asunto;
        `;

        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Ticket de soporte no encontrado.' });
        }

        res.status(200).json({
            mensaje: '¡Ticket eliminado exitosamente!',
            ticket: rows[0]
        });

    } catch (error) {
        console.error('❌ Error al eliminar el ticket:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar el ticket.' });
    }
};
