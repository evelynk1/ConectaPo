import { Router } from 'express';
import { registrarUsuario } from '../controllers/auth.controller.js';

const router = Router();

// Ruta: POST /api/auth/registro
router.post('/registro', registrarUsuario);

export default router;