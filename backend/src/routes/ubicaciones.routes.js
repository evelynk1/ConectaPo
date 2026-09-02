import { Router } from 'express';
import { obtenerRegiones, obtenerCiudades, obtenerComunas } from '../controllers/ubicaciones.controller.js';

const router = Router();

router.get('/regiones', obtenerRegiones);
router.get('/ciudades', obtenerCiudades);
router.get('/comunas', obtenerComunas);

export default router;