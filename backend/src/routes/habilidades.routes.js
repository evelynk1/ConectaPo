import { Router } from 'express';
import { 
    obtenerHabilidades, 
    crearHabilidad, 
    actualizarHabilidad, 
    eliminarHabilidad 
} from '../controllers/habilidades.controller.js';
import { verificarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Ruta pública para listar / vitrinear las habilidades (SELECT)
router.get('/', obtenerHabilidades);

// Rutas protegidas (Solo administradores)
router.post('/', verificarToken, autorizarRoles('ADMIN'), crearHabilidad);          
router.put('/:id', verificarToken, autorizarRoles('ADMIN'), actualizarHabilidad);   
router.delete('/:id', verificarToken, autorizarRoles('ADMIN'), eliminarHabilidad); 

export default router;