import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

// Creamos la "piscina" de conexiones usando la URL secreta de tu .env
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Neon exige SSL para aceptar conexiones externas
  }
});

// Hacemos un "ping" a la base de datos para probar la conexión
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error conectando a Neon:', err.stack);
  } else {
    console.log('✅ Conexión exitosa a Neon PostgreSQL. Hora del servidor DB:', res.rows[0].now);
  }
});