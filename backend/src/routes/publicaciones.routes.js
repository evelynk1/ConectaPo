// src/routes/publicaciones.routes.js
import { Router } from 'express';
import { crearPublicacion } from '../controllers/publicaciones.controller.js';
import { verificarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Ruta protegida: Solo usuarios con rol CLIENTE pueden publicar
router.post('/', verificarToken, autorizarRoles('CLIENTE'), crearPublicacion);

export default router;