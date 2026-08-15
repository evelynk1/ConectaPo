import { Outlet } from 'react-router-dom';

const PrivateLayout = () => {
    return (
        <div className="min-h-screen flex bg-gray-100">
            <aside className="w-64 bg-blue-800 text-white p-4">
                <h2 className="text-lg font-bold mb-4">Panel Usuario</h2>
                <nav>
                    <ul className="space-y-2">
                        <li>Menú Privado 1</li>
                        <li>Menú Privado 2</li>
                    </ul>
                </nav>
            </aside>

            <main className="flex-grow p-6">
                {/* Aquí React Router inyectará MiPerfil o GestionCalendario */}
                <Outlet />
            </main>
        </div>
    );
};

export default PrivateLayout;