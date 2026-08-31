import { Router } from 'express';
import { registrarUsuario, loginUsuario, obtenerPerfil } from '../controllers/auth.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas Publicas
// Rutas de Autenticación
router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario); 


// Rutas protegidas
router.get('/perfil', verificarToken, obtenerPerfil);

export default router;