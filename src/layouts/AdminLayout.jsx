import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div className="min-h-screen flex bg-gray-900 text-gray-100">
            <aside className="w-64 bg-black p-4 border-r border-gray-800 flex flex-col">
                <h2 className="text-lg font-bold mb-8 text-red-500">ADMINISTRACIÓN</h2>
                <nav className="flex-grow">
                    <ul className="space-y-4">
                        {/* Enlaces reales que inyectan las vistas */}
                        <li><Link to="/admin" className="hover:text-red-400 transition-colors">📊 Dashboard</Link></li>
                        <li><Link to="/admin/oficios" className="hover:text-red-400 transition-colors">🛠️ Oficios</Link></li>
                        <li><Link to="/admin/ubicaciones" className="hover:text-red-400 transition-colors">📍 Ubicaciones</Link></li>
                        <li><Link to="/admin/tickets" className="hover:text-red-400 transition-colors">🎫 Tickets</Link></li>
                    </ul>
                </nav>
                <div className="mt-auto">
                    <Link to="/" className="text-sm text-gray-500 hover:text-white">← Volver al sitio</Link>
                </div>
            </aside>

            <main className="flex-grow p-6 bg-gray-900 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;