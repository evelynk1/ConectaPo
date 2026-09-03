import { Router } from 'express';
import { obtenerHabilidades } from '../controllers/habilidades.controller.js';

const router = Router();

// Ruta pública para el vitrineo de habilidades
router.get('/', obtenerHabilidades);

export default router;