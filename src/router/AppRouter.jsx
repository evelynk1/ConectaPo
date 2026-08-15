import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// 1. Layouts
import PublicLayout from '../layouts/PublicLayout';
import PrivateLayout from '../layouts/PrivateLayout';
import AdminLayout from '../layouts/AdminLayout';

// 2. Pages - Públicas
import Home from '../pages/public/Home';
import Buscar from '../pages/public/Buscar';
import Login from '../pages/public/Login';
import Registro from '../pages/public/Registro';

// 3. Pages - Privadas
import MiPerfil from '../pages/private/MiPerfil';
import GestionCalendario from '../pages/private/GestionCalendario';

// 4. Pages - Admin
import DashboardAdmin from '../pages/admin/DashboardAdmin';
import GestionOficios from '../pages/admin/GestionOficios';
import GestionUbicaciones from '../pages/admin/GestionUbicaciones';

// 5. Pages - Error
import NotFound404 from '../pages/error/NotFound404';

const ProtectedRoute = ({ isAllowed, redirectTo = "/login", children }) => {
    if (!isAllowed) {
        return <Navigate to={redirectTo} replace />;
    }
    return children ? children : <Outlet />;
};

export const AppRouter = () => {
    // Estado simulado. Cambia el rol a 'USUARIO', 'ADMIN' o isLogged a false para probar.
    const mockUser = {
        isLogged: true,
        rol: 'ADMIN'
    };

    return (
        <BrowserRouter>
            <Routes>

                {/* RUTAS PÚBLICAS */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/buscar" element={<Buscar />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<Registro />} />
                </Route>

                {/* RUTAS PRIVADAS (Panel de Usuario) */}
                <Route element={
                    <ProtectedRoute isAllowed={mockUser.isLogged && (mockUser.rol === 'USUARIO' || mockUser.rol === 'ADMIN')} />
                }>
                    <Route element={<PrivateLayout />}>
                        <Route path="/panel/perfil" element={<MiPerfil />} />
                        <Route path="/panel/calendario" element={<GestionCalendario />} />
                    </Route>
                </Route>

                {/* RUTAS ADMIN */}
                <Route element={
                    <ProtectedRoute isAllowed={mockUser.isLogged && mockUser.rol === 'ADMIN'} redirectTo="/" />
                }>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin" element={<DashboardAdmin />} />
                        <Route path="/admin/oficios" element={<GestionOficios />} />
                        <Route path="/admin/ubicaciones" element={<GestionUbicaciones />} />
                    </Route>
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound404 />} />

            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;