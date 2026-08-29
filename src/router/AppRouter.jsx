import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '../context/useUser';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import PrivateLayout from '../layouts/PrivateLayout';
import AdminLayout from '../layouts/AdminLayout';

// Páginas Públicas
import Home from '../pages/public/Home';
import Galeria from '../pages/public/Galeria';
import Detalle from '../pages/public/Detalle';
import Login from '../pages/public/Login';
import Registro from '../pages/public/Registro';

// Páginas Privadas (Usuarios)
import MiPerfil from '../pages/private/MiPerfil';
import GestionCalendario from '../pages/private/GestionCalendario';
import CrearTicket from '../pages/private/CrearTicket';

// Páginas de Administración
import DashboardAdmin from '../pages/admin/DashboardAdmin';
import GestionOficios from '../pages/admin/GestionOficios';
import GestionUbicaciones from '../pages/admin/GestionUbicaciones';
import ResolucionTickets from '../pages/admin/ResolucionTickets';

// Errores
import NotFound404 from '../pages/error/NotFound404';

// Componente para proteger rutas según el rol
const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, token } = useUser();

    // Si no hay usuario o token, no está autenticado
    if (!user || !token) {
        return <Navigate to="/login" replace />;
    }

    // Si la ruta requiere un rol y el usuario no lo tiene
    if (allowedRole && user.rol !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ==========================================
                    RUTAS PÚBLICAS
                ========================================== */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/galeria" element={<Galeria />} />
                    <Route path="/detalle/:id" element={<Detalle />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<Registro />} />
                </Route>

                {/* ==========================================
                    RUTAS PRIVADAS (USUARIOS)
                ========================================== */}
                <Route
                    path="/panel"
                    element={
                        <ProtectedRoute allowedRole="USUARIO">
                            <PrivateLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="perfil" element={<MiPerfil />} />
                    <Route path="calendario" element={<GestionCalendario />} />
                    <Route path="tickets" element={<CrearTicket />} />
                </Route>

                {/* ==========================================
                    RUTAS DE ADMINISTRACIÓN
                ========================================== */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRole="ADMIN">
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<DashboardAdmin />} />
                    <Route path="oficios" element={<GestionOficios />} />
                    <Route path="ubicaciones" element={<GestionUbicaciones />} />
                    <Route path="tickets" element={<ResolucionTickets />} />
                </Route>

                {/* ==========================================
                    RUTA NOT FOUND (404)
                ========================================== */}
                <Route path="*" element={<NotFound404 />} />
            </Routes>
        </BrowserRouter>
    );
}