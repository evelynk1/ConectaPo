import { Router } from 'express';
import { 
    crearEvaluacion, 
    obtenerEvaluacionesPorPublicacion 
} from '../controllers/evaluaciones.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

// ==========================================
// RUTAS PÚBLICAS
// ==========================================
// Cualquier visitante puede ver el promedio y las reseñas de una publicación
router.get('/publicacion/:publicacion_id', obtenerEvaluacionesPorPublicacion);

// ==========================================
// RUTAS PRIVADAS
// ==========================================
// El usuario logueado (cliente o maestro) envía la evaluación con el bloque_horario_id en el body
router.post('/', verificarToken, crearEvaluacion);

export default router;