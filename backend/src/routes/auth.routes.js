import { Router } from 'express';
import { registrarUsuario, loginUsuario, obtenerPerfil } from '../controllers/auth.controller.js';
import { verificarToken, verificarRol } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas Públicas
router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario); 

// Rutas protegidas (Cualquier usuario autenticado)
router.get('/perfil', verificarToken, obtenerPerfil);

// Ruta protegida exclusiva para administradores (CON-85)
router.get('/admin-dashboard', verificarToken, verificarRol('admin'), (req, res) => {
  res.json({ mensaje: 'Panel de administración exclusivo' });
});

export default router;