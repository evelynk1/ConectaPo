import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PublicLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Navbar fijo superior */}
            <Navbar />

            {/* Contenido principal con padding superior para compensar el navbar fijo */}
            <main className="flex-grow pt-16 p-4">
                <Outlet />
            </main>

            {/* Pie de página */}
            <Footer />
        </div>
    );
};

export default PublicLayout;