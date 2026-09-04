import { Router } from 'express';
import { 
    obtenerRegiones, crearRegion, actualizarRegion, eliminarRegion,
    obtenerCiudades, crearCiudad, actualizarCiudad, eliminarCiudad,
    obtenerComunas, crearComuna, actualizarComuna, eliminarComuna 
} from '../controllers/ubicaciones.controller.js';
import { verificarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Regiones
router.get('/regiones', obtenerRegiones);
router.post('/regiones', verificarToken, autorizarRoles('ADMIN'), crearRegion);
router.put('/regiones/:id', verificarToken, autorizarRoles('ADMIN'), actualizarRegion);
router.delete('/regiones/:id', verificarToken, autorizarRoles('ADMIN'), eliminarRegion);

// Ciudades
router.get('/ciudades', obtenerCiudades);
router.post('/ciudades', verificarToken, autorizarRoles('ADMIN'), crearCiudad);
router.put('/ciudades/:id', verificarToken, autorizarRoles('ADMIN'), actualizarCiudad);
router.delete('/ciudades/:id', verificarToken, autorizarRoles('ADMIN'), eliminarCiudad);

// Comunas
router.get('/comunas', obtenerComunas);
router.post('/comunas', verificarToken, autorizarRoles('ADMIN'), crearComuna);
router.put('/comunas/:id', verificarToken, autorizarRoles('ADMIN'), actualizarComuna);
router.delete('/comunas/:id', verificarToken, autorizarRoles('ADMIN'), eliminarComuna);

export default router;