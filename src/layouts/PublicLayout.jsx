import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="bg-white shadow-sm p-4">
                <h1 className="text-xl font-bold text-blue-600">Conectapo (Público)</h1>
            </header>

            <main className="flex-grow p-4">
                {/* Aquí React Router inyectará Home, Buscar o Login */}
                <Outlet />
            </main>

            <footer className="bg-gray-800 text-white p-4 text-center">
                <p>Footer Público</p>
            </footer>
        </div>
    );
};

export default PublicLayout;