import { Router } from 'express';
import {
    crearPublicacion,
    obtenerPublicaciones,
    actualizarPublicacion,
    subirFotosPublicacion,
    eliminarPublicacion,
    obtenerPublicacion,
    obtenerMisPublicaciones,
    registrarVista
} from '../controllers/publicaciones.controller.js';
import { verificarToken, autorizarRoles } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

// Ruta pública para listar todas las publicaciones activas (SELECT)
router.get('/', obtenerPublicaciones);
router.get('/mis-publicaciones', verificarToken, autorizarRoles('PROFESIONAL'), obtenerMisPublicaciones);
router.get('/:id', obtenerPublicacion);
router.patch('/:id/vistas', registrarVista);

// Ruta protegida: Solo usuarios con rol CLIENTE pueden publicar
router.post('/', verificarToken, autorizarRoles('PROFESIONAL'), crearPublicacion);

// Ruta protegida para actualizar una publicación por su ID (UPDATE)
router.put('/:id', verificarToken, autorizarRoles('PROFESIONAL'), actualizarPublicacion);

// Ruta protegida para eliminar una publicación por su ID (DELETE)
router.delete('/:id', verificarToken, eliminarPublicacion);

router.put('/:id/fotos', verificarToken, upload.fields([
    { name: 'foto1', maxCount: 1 },
    { name: 'foto2', maxCount: 1 },
    { name: 'foto3', maxCount: 1 }
]), subirFotosPublicacion);

export default router;
