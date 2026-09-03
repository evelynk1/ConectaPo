import { Router } from 'express';
import { 
    obtenerRegiones, 
    obtenerCiudades, 
    obtenerComunas,
    actualizarRegion,
    actualizarCiudad,
    actualizarComuna
} from '../controllers/ubicaciones.controller.js';
import { verificarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// ==========================================
// RUTAS GET (Públicas o protegidas para listar)
// ==========================================
router.get('/regiones', obtenerRegiones);
router.get('/ciudades', obtenerCiudades);
router.get('/comunas', obtenerComunas);

// ==========================================
// RUTAS PUT (Protegidas: Solo Admin)
// ==========================================
router.put('/regiones/:id', verificarToken, autorizarRoles('ADMIN'), actualizarRegion);
router.put('/ciudades/:id', verificarToken, autorizarRoles('ADMIN'), actualizarCiudad);
router.put('/comunas/:id', verificarToken, autorizarRoles('ADMIN'), actualizarComuna);

export default router;