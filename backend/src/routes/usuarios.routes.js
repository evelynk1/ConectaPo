import { Router } from 'express';
import { obtenerPerfil, actualizarPerfil, subirAvatar } from '../controllers/usuarios.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.get('/perfil', verificarToken, obtenerPerfil);
router.put('/perfil', verificarToken, actualizarPerfil);
router.put('/avatar', verificarToken, upload.single('avatar'), subirAvatar);

export default router;