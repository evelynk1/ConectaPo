import { pool } from '../config/db.js';

export const crearPublicacion = async (req, res) => {
    try {
        // 1. Recibimos TODOS los campos posibles desde el body
        const {
            titulo,
            descripcion,
            precio_base, // Siempre en peso chileno
            oficio_id,
            comuna_id,
            villa_poblacion_id,
            anos_experiencia,
            es_horario_conversable,
            foto_url_1,
            foto_url_2,
            foto_url_3
        } = req.body;

        // 2. ID del usuario desde el token 
        const usuario_id = req.usuario.id;

        // 3. se validan los campos que son NOT NULL
        if (!titulo || !descripcion || !precio_base) {
            return res.status(400).json({ error: 'El título, descripción y precio_base son obligatorios.' });
        }

        // 4. la consulta SQL 
        const query = `
      INSERT INTO negocio.publicaciones (
        usuario_id, 
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
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *; 
    `;

        // 5. Inyectamos los valores 
        const values = [
            usuario_id,
            titulo,
            descripcion,
            precio_base,
            oficio_id || null,
            comuna_id || null,
            villa_poblacion_id || null,
            anos_experiencia || 0,
            es_horario_conversable !== undefined ? es_horario_conversable : true,
            foto_url_1 || null,
            foto_url_2 || null,
            foto_url_3 || null
        ];

        const { rows } = await pool.query(query, values);

        res.status(201).json({
            mensaje: '¡Publicación completa creada exitosamente!',
            publicacion: rows[0]
        });

    } catch (error) {
        console.error('❌ Error al crear publicación:', error);
        res.status(500).json({ error: 'Error interno del servidor al crear la publicación.' });
    }
};