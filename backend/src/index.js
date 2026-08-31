import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // Carga las variables del archivo .env automáticamente
import { pool } from './config/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARES GLOBALES
// ==========================================
// Permite que tu frontend se comunique con este backend sin bloqueos de seguridad
app.use(cors());
// Permite que el backend entienda los datos que lleguen en formato JSON
app.use(express.json());

// ==========================================
// RUTA DE PRUEBA
// ==========================================
app.get('/', (req, res) => {
    res.json({
        mensaje: '¡Servidor de ConectaPo funcionando al 100%!',
        estado: 'Online'
    });
});

// ==========================================
// INICIO DEL SERVIDOR
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});