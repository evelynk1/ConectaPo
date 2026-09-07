import { Router } from 'express';
import {
    crearPublicacion,
    obtenerPublicaciones,
    actualizarPublicacion,
    subirFotosPublicacion,
    eliminarPublicacion,
    obtenerMisPublicaciones, // <-- Faltaba importar para el panel
    obtenerPublicacion,      // <-- Faltaba para ver el detalle de 1 servicio
    registrarVista           // <-- Faltaba para el contador de visitas
} from '../controllers/publicaciones.controller.js';
import { verificarToken, autorizarRoles } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

// ==========================================
// RUTAS PÚBLICAS
// ==========================================
// Listar todas las publicaciones activas
router.get('/', obtenerPublicaciones);

// ==========================================
// RUTAS PRIVADAS (Solo rol CLIENTE)
// ==========================================
// OJO: Esta ruta debe ir ANTES de '/:id' para que Express no confunda "mis-publicaciones" con un ID
router.get('/mis-publicaciones', verificarToken, autorizarRoles('CLIENTE'), obtenerMisPublicaciones);

// Crear una publicación
router.post('/', verificarToken, autorizarRoles('CLIENTE'), crearPublicacion);

// Actualizar una publicación por su ID
router.put('/:id', verificarToken, autorizarRoles('CLIENTE'), actualizarPublicacion);

// Eliminar una publicación por su ID
router.delete('/:id', verificarToken, autorizarRoles('CLIENTE'), eliminarPublicacion);

// Subir fotos a la publicación
router.put('/:id/fotos', verificarToken, autorizarRoles('CLIENTE'), upload.fields([
    { name: 'foto1', maxCount: 1 },
    { name: 'foto2', maxCount: 1 },
    { name: 'foto3', maxCount: 1 }
]), subirFotosPublicacion);

// ==========================================
// RUTAS PÚBLICAS CON PARÁMETROS (Al final)
// ==========================================
router.get('/:id', obtenerPublicacion);
router.patch('/:id/vistas', registrarVista);

export default router;