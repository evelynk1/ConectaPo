import { pool } from '../config/db.js';

export const crearTicket = async (req, res) => {
    try {
        const { asunto, descripcion } = req.body;
        const usuario_id = req.usuario.id; // Viene del token gracias al middleware verificarToken

        if (!asunto || !descripcion) {
            return res.status(400).json({ error: 'El asunto y la descripción son obligatorios para el ticket.' });
        }

        const query = `
            INSERT INTO soporte.tickets (usuario_id, asunto, descripcion, estado)
            VALUES ($1, $2, $3, 'ABIERTO')
            RETURNING *;
        `;

        const { rows } = await pool.query(query, [usuario_id, asunto, descripcion]);

        res.status(201).json({
            mensaje: '¡Ticket de soporte creado exitosamente!',
            ticket: rows[0]
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