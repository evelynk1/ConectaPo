import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div className="min-h-screen flex bg-gray-900 text-gray-100">
            <aside className="w-64 bg-black p-4 border-r border-gray-800">
                <h2 className="text-lg font-bold mb-4 text-red-500">ADMINISTRACIÓN</h2>
                <nav>
                    <ul className="space-y-2">
                        <li>Dashboard</li>
                        <li>Oficios</li>
                    </ul>
                </nav>
            </aside>

            <main className="flex-grow p-6 bg-gray-900">
                {/* Aquí React Router inyectará las vistas de Admin */}
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;