import { Router } from 'express';
import { 
  registrarUsuario, 
  loginUsuario, 
  obtenerPerfil, 
  actualizarPerfil 
} from '../controllers/auth.controller.js';
import { verificarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas Públicas
router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);

// Rutas protegidas (Cualquier usuario autenticado)
router.get('/perfil', verificarToken, obtenerPerfil);
router.put('/perfil', verificarToken, actualizarPerfil);

// Ruta protegida exclusiva para administradores
router.get('/admin-dashboard', verificarToken, autorizarRoles('ADMIN'), (req, res) => {
  res.json({ mensaje: 'Panel de administración exclusivo' });
});

export default router;