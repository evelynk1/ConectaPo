import { Router } from 'express';
import { 
    crearOficio, 
    obtenerOficios, 
    actualizarOficio,
    eliminarOficio 
} from '../controllers/oficios.controller.js';
import { verificarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Ruta pública o protegida para listar todos los oficios
router.get('/', obtenerOficios);

// Ruta súper protegida: Solo el administrador puede crear oficios
router.post('/', verificarToken, autorizarRoles('ADMIN'), crearOficio);

// Ruta para actualizar un oficio (Solo ADMIN)
router.put('/:id', verificarToken, autorizarRoles('ADMIN'), actualizarOficio);

// Ruta para eliminar un oficio (Solo ADMIN)
router.delete('/:id', verificarToken, autorizarRoles('ADMIN'), eliminarOficio);

export default router;