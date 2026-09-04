import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { pool } from './config/db.js';

// ==========================================
// IMPORTACIÓN DE RUTAS
// ==========================================
import authRoutes from './routes/auth.routes.js';
import publicacionesRoutes from './routes/publicaciones.routes.js';
import oficiosRoutes from './routes/oficios.routes.js'; 
import ubicacionesRoutes from './routes/ubicaciones.routes.js';
import ticketsRoutes from './routes/tickets.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import habilidadesRoutes from './routes/habilidades.routes.js';
import horariosRoutes from './routes/horarios.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ==========================================
// MONTAJE DE RUTAS EN LA API
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/publicaciones', publicacionesRoutes);
app.use('/api/oficios', oficiosRoutes);
app.use('/api/ubicaciones', ubicacionesRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/habilidades', habilidadesRoutes);
app.use('/api/horarios', horariosRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: '¡Servidor de ConectaPo funcionando al 100%!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});