import { Router } from 'express';
import { crearTicket, obtenerTickets } from '../controllers/tickets.controller.js';
import { verificarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', verificarToken, crearTicket);
router.get('/', verificarToken, autorizarRoles('ADMIN'), obtenerTickets);

export default router;