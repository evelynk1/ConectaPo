import { Router } from 'express';
import { crearPublicacion, obtenerPublicaciones } from '../controllers/publicaciones.controller.js';
import { verificarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Ruta pública para listar todas las publicaciones activas (SELECT)
router.get('/', obtenerPublicaciones);

// Ruta protegida: Solo usuarios con rol CLIENTE pueden publicar
router.post('/', verificarToken, autorizarRoles('CLIENTE'), crearPublicacion);
router.put('/:id', verificarToken, actualizarPublicacion); // 👈 ¡Ruta PUT agregada!

export default router;