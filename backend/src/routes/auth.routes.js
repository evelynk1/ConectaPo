import { Router } from 'express';
import {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
  actualizarPerfil,
  desactivarUsuario
} from '../controllers/auth.controller.js';
import { verificarToken, autorizarRoles } from '../middlewares/auth.middleware.js';
import { solicitarRecuperacion, resetearPassword } from '../controllers/auth.controller.js';

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

// RUTAS DE RECUPERACIÓN
router.post('/recuperar-password', solicitarRecuperacion);
router.put('/resetear-password', resetearPassword);


export default router;