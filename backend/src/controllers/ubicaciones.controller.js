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