import { Router } from 'express';
import {
    crearPublicacion,
    obtenerPublicaciones,
    actualizarPublicacion
} from '../controllers/publicaciones.controller.js';
import { verificarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas de publicaciones
router.get('/', obtenerPublicaciones);
router.post('/', verificarToken, autorizarRoles('CLIENTE'), crearPublicacion);
router.put('/:id', verificarToken, actualizarPublicacion); // 👈 ¡Ruta PUT agregada!

export default router;