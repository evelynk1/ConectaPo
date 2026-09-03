import { Router } from 'express';
import { crearOficio, obtenerOficios } from '../controllers/oficios.controller.js';
import { verificarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Ruta pública o protegida para listar todos los oficios
router.get('/', obtenerOficios);

// Ruta súper protegida: Solo el administrador puede crear oficios
router.post('/', verificarToken, autorizarRoles('ADMIN'), crearOficio);

export default router;