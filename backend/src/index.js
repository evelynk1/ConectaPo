import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { pool } from './config/db.js';
import authRoutes from './routes/auth.routes.js'; 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); // Permite recibir datos en formato JSON desde el frontend

// ==========================================
// RUTAS DE LA API
// ==========================================
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: '¡Servidor de ConectaPo funcionando al 100%!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});