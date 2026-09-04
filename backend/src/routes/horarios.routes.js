import { Router } from 'express';
import { 
    obtenerHorariosPorPublicacion, 
    guardarHorariosMasivos, 
    eliminarBloqueHorario,
    reservarBloque,
    cambiarEstadoBloque
} from '../controllers/horarios.controller.js';
import { verificarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// ==========================================
// RUTAS PÚBLICAS (Visitantes y todos pueden mirar)
// ==========================================
router.get('/publicacion/:publicacion_id', obtenerHorariosPorPublicacion);

// ==========================================
// RUTAS PRIVADAS (Requieren estar logueados)
// ==========================================

// El cliente 
router.put('/bloque/:id/reservar', verificarToken, autorizarRoles('CLIENTE'), reservarBloque); 

// El maestro genera o edita sus horarios
router.post('/publicacion/:publicacion_id/masivo', verificarToken, guardarHorariosMasivos);
router.delete('/bloque/:id', verificarToken, eliminarBloqueHorario);
router.put('/bloque/:id/estado', verificarToken, cambiarEstadoBloque);

export default router;