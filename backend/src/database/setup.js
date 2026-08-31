import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/db.js';

// Truco de Node.js para obtener las rutas absolutas cuando usamos "type": "module"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function inicializarBaseDeDatos() {
  try {
    console.log('⏳ Leyendo el archivo schema.sql...');
    // Leemos el archivo SQL que acabas de crear
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

    console.log('🚀 Enviando instrucciones a Neon...');
    // Mandamos el código SQL a ejecutarse
    await pool.query(sql);

    console.log('✅ ¡Base de datos inicializada con éxito! Las tablas están listas.');
  } catch (error) {
    console.error('❌ Error fatal al inicializar la base de datos:', error);
  } finally {
    // Cerramos la conexión para que la terminal no se quede pegada
    await pool.end(); 
  }
}

inicializarBaseDeDatos();