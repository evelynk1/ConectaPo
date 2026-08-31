import { Router } from 'express';
import { registrarUsuario, loginUsuario } from '../controllers/auth.controller.js';

const router = Router();

// Rutas de Autenticación
router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario); 

export default router;