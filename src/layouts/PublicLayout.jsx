import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PublicLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header fijo */}
            <header className="sticky top-0 z-50 bg-white shadow-sm">
                <Navbar />
            </header>

            <main className="flex-grow p-4">
                <Outlet />
            </main>

            <footer className="bg-gray-800 text-white p-4 text-center">
                <Footer />
            </footer>
        </div>
    )
}

export default PublicLayout