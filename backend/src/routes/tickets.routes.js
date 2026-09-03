import { Router } from 'express';
import { crearTicket, obtenerTickets, actualizarTicket } from '../controllers/tickets.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', obtenerTickets);
router.post('/', verificarToken, crearTicket);
router.put('/:id', verificarToken, actualizarTicket);

export default router;