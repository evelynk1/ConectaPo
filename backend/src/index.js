import express from 'express';
import cors from 'cors';
import 'dotenv/config';

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
import evaluacionesRoutes from './routes/evaluaciones.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Las peticiones sin Origin (health checks, curl o tráfico servidor a servidor)
    // no necesitan validación CORS.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origen no permitido por CORS.'));
  },
}));
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
app.use('/api/evaluaciones', evaluacionesRoutes);

app.get('/', (_req, res) => {
  res.json({ mensaje: '¡Servidor de ConectaPo funcionando al 100%!' });
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

app.use((error, req, res, _next) => {
  void _next;
  console.error('❌ Error no controlado:', error);
  res.status(500).json({ error: 'Error interno del servidor.' });
});
