import { Router } from 'express';
import { 
    crearPublicacion, 
    obtenerPublicaciones, 
    actualizarPublicacion, 
    eliminarPublicacion 
} from '../controllers/publicaciones.controller.js';
import { verificarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Ruta pública para listar todas las publicaciones activas (SELECT)
router.get('/', obtenerPublicaciones);

// Ruta protegida: Solo usuarios con rol CLIENTE pueden publicar
router.post('/', verificarToken, autorizarRoles('CLIENTE'), crearPublicacion);

// Ruta protegida para actualizar una publicación por su ID (UPDATE)
router.put('/:id', verificarToken, actualizarPublicacion);

// Ruta protegida para eliminar una publicación por su ID (DELETE)
router.delete('/:id', verificarToken, eliminarPublicacion);

export default router;