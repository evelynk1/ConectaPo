import { Router } from 'express';
import { crearOficio } from '../controllers/oficios.controller.js';
import { verificarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Ruta súper protegida: Solo el administrador puede crear oficios
router.post('/', verificarToken, autorizarRoles('ADMIN'), crearOficio);

export default router;