import { Router } from 'express';
import { registrarUsuario, loginUsuario, obtenerPerfil } from '../controllers/auth.controller.js';
// 1. Importamos exactamente el nombre que pusimos en el middleware
import { verificarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas Públicas
router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);

// Rutas protegidas (Cualquier usuario autenticado)
router.get('/perfil', verificarToken, obtenerPerfil);

// Ruta protegida exclusiva para administradores
// 2. Usamos autorizarRoles y ponemos 'ADMIN' (en mayúscula según BD)
router.get('/admin-dashboard', verificarToken, autorizarRoles('ADMIN'), (req, res) => {
  res.json({ mensaje: 'Panel de administración exclusivo' });
});

export default router;