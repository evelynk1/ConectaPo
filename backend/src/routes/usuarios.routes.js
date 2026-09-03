import { Router } from 'express';
import { obtenerPerfil, actualizarPerfil } from '../controllers/auth.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Ruta GET para consultar el perfil del usuario autenticado
router.get('/perfil', verificarToken, obtenerPerfil);

router.put('/perfil', verificarToken, actualizarPerfil);

export default router;