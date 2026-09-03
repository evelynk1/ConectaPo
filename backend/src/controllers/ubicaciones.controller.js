import { pool } from '../config/db.js';

export const obtenerRegiones = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre FROM ubicaciones.regiones ORDER BY nombre ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener regiones:', error);
    res.status(500).json({ mensaje: 'Error al obtener las regiones' });
  }
};

export const obtenerCiudades = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, region_id, nombre FROM ubicaciones.ciudades ORDER BY nombre ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener ciudades:', error);
    res.status(500).json({ mensaje: 'Error al obtener las ciudades' });
  }
};

export const obtenerComunas = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, ciudad_id, nombre FROM ubicaciones.comunas ORDER BY nombre ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener comunas:', error);
    res.status(500).json({ mensaje: 'Error al obtener las comunas' });
  }
};

export const actualizarRegion = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        // ==========================================
        // ACTUALIZACIÓN PARCIAL CON COALESCE (PUT) - REGIÓN
        // ==========================================
        const query = `
            UPDATE ubicaciones.regiones 
            SET nombre = COALESCE($1, nombre)
            WHERE id = $2
            RETURNING id, nombre;
        `;

        const { rows } = await pool.query(query, [nombre, id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Región no encontrada.' });
        }

        res.json({
            mensaje: '¡Región actualizada exitosamente!',
            region: rows[0]
        });

    } catch (error) {
        console.error('❌ Error al actualizar la región:', error);

        if (error.code === '23505') {
            return res.status(400).json({ error: 'Ya existe otra región con ese nombre.' });
        }

        res.status(500).json({ error: 'Error interno al actualizar la región.' });
    }
};

export const actualizarCiudad = async (req, res) => {
    try {
        const { id } = req.params;
        const { region_id, nombre } = req.body;

        // ==========================================
        // ACTUALIZACIÓN PARCIAL CON COALESCE (PUT) - CIUDAD
        // ==========================================
        const query = `
            UPDATE ubicaciones.ciudades 
            SET 
                region_id = COALESCE($1, region_id),
                nombre = COALESCE($2, nombre)
            WHERE id = $3
            RETURNING id, region_id, nombre;
        `;

        const { rows } = await pool.query(query, [region_id, nombre, id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Ciudad no encontrada.' });
        }

        res.json({
            mensaje: '¡Ciudad actualizada exitosamente!',
            ciudad: rows[0]
        });

    } catch (error) {
        console.error('❌ Error al actualizar la ciudad:', error);

        if (error.code === '23505') {
            return res.status(400).json({ error: 'Ya existe otra ciudad con ese nombre.' });
        }

        res.status(500).json({ error: 'Error interno al actualizar la ciudad.' });
    }
};

export const actualizarComuna = async (req, res) => {
    try {
        const { id } = req.params;
        const { ciudad_id, nombre } = req.body;

        // ==========================================
        // ACTUALIZACIÓN PARCIAL CON COALESCE (PUT) - COMUNA
        // ==========================================
        const query = `
            UPDATE ubicaciones.comunas 
            SET 
                ciudad_id = COALESCE($1, ciudad_id),
                nombre = COALESCE($2, nombre)
            WHERE id = $3
            RETURNING id, ciudad_id, nombre;
        `;

        const { rows } = await pool.query(query, [ciudad_id, nombre, id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Comuna no encontrada.' });
        }

        res.json({
            mensaje: '¡Comuna actualizada exitosamente!',
            comuna: rows[0]
        });

    } catch (error) {
        console.error('❌ Error al actualizar la comuna:', error);

        if (error.code === '23505') {
            return res.status(400).json({ error: 'Ya existe otra comuna con ese nombre.' });
        }

        res.status(500).json({ error: 'Error interno al actualizar la comuna.' });
    }
};