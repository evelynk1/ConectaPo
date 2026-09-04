import { pool } from '../config/db.js';

// ==========================================
// REGIONES (CRUD Completo)
// ==========================================
export const obtenerRegiones = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre FROM ubicaciones.regiones ORDER BY nombre ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener regiones:', error);
    res.status(500).json({ mensaje: 'Error al obtener las regiones' });
  }
};

export const crearRegion = async (req, res) => {
    try {
        const { nombre } = req.body;
        if (!nombre) {
            return res.status(400).json({ error: 'El nombre de la región es obligatorio.' });
        }
        const query = `INSERT INTO ubicaciones.regiones (nombre) VALUES ($1) RETURNING id, nombre;`;
        const { rows } = await pool.query(query, [nombre]);
        res.status(201).json({ mensaje: '¡Región creada exitosamente!', region: rows[0] });
    } catch (error) {
        console.error('❌ Error al crear región:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Ya existe una región con ese nombre.' });
        }
        res.status(500).json({ error: 'Error interno al crear la región.' });
    }
};

export const actualizarRegion = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
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
        res.json({ mensaje: '¡Región actualizada exitosamente!', region: rows[0] });
    } catch (error) {
        console.error('❌ Error al actualizar la región:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Ya existe otra región con ese nombre.' });
        }
        res.status(500).json({ error: 'Error interno al actualizar la región.' });
    }
};

export const eliminarRegion = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `DELETE FROM ubicaciones.regiones WHERE id = $1 RETURNING id, nombre;`;
        const { rows } = await pool.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Región no encontrada.' });
        }
        res.json({ mensaje: '¡Región eliminada exitosamente!', region: rows[0] });
    } catch (error) {
        console.error('❌ Error al eliminar región:', error);
        if (error.code === '23503' || error.code === '23001') {
            return res.status(400).json({ error: 'No se puede eliminar la región porque está asociada a ciudades existentes.' });
        }
        res.status(500).json({ error: 'Error interno al eliminar la región.' });
    }
};

// ==========================================
// CIUDADES (CRUD Completo)
// ==========================================
export const obtenerCiudades = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, region_id, nombre FROM ubicaciones.ciudades ORDER BY nombre ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener ciudades:', error);
    res.status(500).json({ mensaje: 'Error al obtener las ciudades' });
  }
};

export const crearCiudad = async (req, res) => {
    try {
        const { region_id, nombre } = req.body;
        if (!region_id || !nombre) {
            return res.status(400).json({ error: 'El region_id y el nombre son obligatorios.' });
        }
        const query = `INSERT INTO ubicaciones.ciudades (region_id, nombre) VALUES ($1, $2) RETURNING id, region_id, nombre;`;
        const { rows } = await pool.query(query, [region_id, nombre]);
        res.status(201).json({ mensaje: '¡Ciudad creada exitosamente!', ciudad: rows[0] });
    } catch (error) {
        console.error('❌ Error al crear ciudad:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Ya existe una ciudad con ese nombre.' });
        }
        res.status(500).json({ error: 'Error interno al crear la ciudad.' });
    }
};

export const actualizarCiudad = async (req, res) => {
    try {
        const { id } = req.params;
        const { region_id, nombre } = req.body;
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
        res.json({ mensaje: '¡Ciudad actualizada exitosamente!', ciudad: rows[0] });
    } catch (error) {
        console.error('❌ Error al actualizar la ciudad:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Ya existe otra ciudad con ese nombre.' });
        }
        res.status(500).json({ error: 'Error interno al actualizar la ciudad.' });
    }
};

export const eliminarCiudad = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `DELETE FROM ubicaciones.ciudades WHERE id = $1 RETURNING id, nombre;`;
        const { rows } = await pool.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Ciudad no encontrada.' });
        }
        res.json({ mensaje: '¡Ciudad eliminada exitosamente!', ciudad: rows[0] });
    } catch (error) {
        console.error('❌ Error al eliminar ciudad:', error);
        if (error.code === '23503' || error.code === '23001') {
            return res.status(400).json({ error: 'No se puede eliminar la ciudad porque está asociada a comunas existentes.' });
        }
        res.status(500).json({ error: 'Error interno al eliminar la ciudad.' });
    }
};

// ==========================================
// COMUNAS (CRUD Completo)
// ==========================================
export const obtenerComunas = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, ciudad_id, nombre FROM ubicaciones.comunas ORDER BY nombre ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener comunas:', error);
    res.status(500).json({ mensaje: 'Error al obtener las comunas' });
  }
};

export const crearComuna = async (req, res) => {
    try {
        const { ciudad_id, nombre } = req.body;
        if (!ciudad_id || !nombre) {
            return res.status(400).json({ error: 'El ciudad_id y el nombre son obligatorios.' });
        }
        const query = `INSERT INTO ubicaciones.comunas (ciudad_id, nombre) VALUES ($1, $2) RETURNING id, ciudad_id, nombre;`;
        const { rows } = await pool.query(query, [ciudad_id, nombre]);
        res.status(201).json({ mensaje: '¡Comuna creada exitosamente!', comuna: rows[0] });
    } catch (error) {
        console.error('❌ Error al crear comuna:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Ya existe una comuna con ese nombre.' });
        }
        res.status(500).json({ error: 'Error interno al crear la comuna.' });
    }
};

export const actualizarComuna = async (req, res) => {
    try {
        const { id } = req.params;
        const { ciudad_id, nombre } = req.body;
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
        res.json({ mensaje: '¡Comuna actualizada exitosamente!', comuna: rows[0] });
    } catch (error) {
        console.error('❌ Error al actualizar la comuna:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Ya existe otra comuna con ese nombre.' });
        }
        res.status(500).json({ error: 'Error interno al actualizar la comuna.' });
    }
};

export const eliminarComuna = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `DELETE FROM ubicaciones.comunas WHERE id = $1 RETURNING id, nombre;`;
        const { rows } = await pool.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Comuna no encontrada.' });
        }
        res.json({ mensaje: '¡Comuna eliminada exitosamente!', comuna: rows[0] });
    } catch (error) {
        console.error('❌ Error al eliminar comuna:', error);
        if (error.code === '23503' || error.code === '23001') {
            return res.status(400).json({ error: 'No se puede eliminar la comuna porque está asociada a publicaciones o registros existentes.' });
        }
        res.status(500).json({ error: 'Error interno al eliminar la comuna.' });
    }
};