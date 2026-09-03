import { pool } from '../config/db.js';
import { Router } from 'express';

// ==========================================
// OBTENER PERFIL DEL USUARIO LOGUEADO
// ==========================================
export const obtenerPerfil = async (req, res) => {
    try {
        const usuario_id = req.usuario.id; // Viene del token

        const query = `
            SELECT id, rut, nombres, primer_apellido, segundo_apellido, genero, 
                   email, telefono, rol, avatar_url, comuna_id, villa_poblacion_id, 
                   instagram_url, facebook_url, created_at 
            FROM auth.usuarios 
            WHERE id = $1;
        `;

        const { rows } = await pool.query(query, [usuario_id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.json({
            usuario: rows[0]
        });

    } catch (error) {
        console.error('❌ Error al obtener el perfil:', error);
        res.status(500).json({ error: 'Error interno al obtener el perfil.' });
    }
};

// ==========================================
// ACTUALIZAR PERFIL DEL USUARIO LOGUEADO
// ==========================================
export const actualizarPerfil = async (req, res) => {
    try {
        const usuario_id = req.usuario.id;
        const { nombres, primer_apellido, segundo_apellido, telefono, avatar_url, comuna_id, villa_poblacion_id, instagram_url, facebook_url } = req.body;

        const query = `
            UPDATE auth.usuarios 
            SET nombres = COALESCE($1, nombres),
                primer_apellido = COALESCE($2, primer_apellido),
                segundo_apellido = COALESCE($3, segundo_apellido),
                telefono = COALESCE($4, telefono),
                avatar_url = COALESCE($5, avatar_url),
                comuna_id = COALESCE($6, comuna_id),
                villa_poblacion_id = COALESCE($7, villa_poblacion_id),
                instagram_url = COALESCE($8, instagram_url),
                facebook_url = COALESCE($9, facebook_url)
            WHERE id = $10
            RETURNING id, nombres, primer_apellido, email, telefono, avatar_url;
        `;

        const values = [
            nombres, primer_apellido, segundo_apellido, telefono, 
            avatar_url, comuna_id, villa_poblacion_id, instagram_url, 
            facebook_url, usuario_id
        ];

        const { rows } = await pool.query(query, values);

        res.json({
            mensaje: '¡Perfil actualizado exitosamente!',
            usuario: rows[0]
        });

    } catch (error) {
        console.error('❌ Error al actualizar el perfil:', error);
        res.status(500).json({ error: 'Error interno al actualizar el perfil.' });
    }
};

// ==========================================
// CONFIGURACIÓN DE RUTAS (PUT Y GET)
// ==========================================

const router = Router();

// Ruta GET para obtener el perfil del usuario autenticado
router.get('/perfil', verificarToken, obtenerPerfil);

// RUTA PUT AÑADIDA:

router.put('/perfil', verificarToken, actualizarPerfil);

export default router;
