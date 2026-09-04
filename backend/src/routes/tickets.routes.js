import { Router } from 'express';
import { 
    crearTicket, 
    obtenerTickets, 
    actualizarTicket, 
    eliminarTicket 
} from '../controllers/tickets.controller.js';
import { verificarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Listar todos los tickets (Idealmente solo para ADMIN, o abierto según prefieras)
router.get('/', verificarToken, autorizarRoles('ADMIN'), obtenerTickets);

// Crear un ticket (Cualquier usuario autenticado)
router.post('/', verificarToken, crearTicket);

// Actualizar un ticket (Por ejemplo, cambiar estado o descripción)
router.put('/:id', verificarToken, actualizarTicket);

// Eliminar un ticket
router.delete('/:id', verificarToken, eliminarTicket);

export default router;