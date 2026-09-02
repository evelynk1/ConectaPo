import { Router } from 'express';
import { obtenerPerfil, actualizarPerfil } from '../controllers/usuarios.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas protegidas para el usuario autenticado
router.get('/perfil', verificarToken, obtenerPerfil);
router.put('/perfil', verificarToken, actualizarPerfil);

export default router;