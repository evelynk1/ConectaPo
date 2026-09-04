import { Router } from 'express';
import { 
  registrarUsuario, 
  loginUsuario, 
  obtenerPerfil, 
  actualizarPerfil,
  desactivarUsuario // 1. Añadido a las importaciones
} from '../controllers/auth.controller.js';
import { verificarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas Públicas
router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);

// Rutas protegidas (Cualquier usuario autenticado)
router.get('/perfil', verificarToken, obtenerPerfil);
router.put('/perfil', verificarToken, actualizarPerfil);

// Ruta protegida de desactivación (Ejemplo: Solo administradores pueden desactivar usuarios)
router.delete('/usuario/:id', verificarToken, autorizarRoles('ADMIN'), desactivarUsuario);

// Ruta protegida exclusiva para administradores
router.get('/admin-dashboard', verificarToken, autorizarRoles('ADMIN'), (req, res) => {
  res.json({ mensaje: 'Panel de administración exclusivo' });
});

export default router;