import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PublicLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 pt-16">
            <Navbar />

            <main className="flex-grow p-4">
                <Outlet />
            </main>

            <footer className="bg-gray-800 text-white p-4 text-center">
                <Footer />
            </footer>
        </div>
    )
}

export default PublicLayout;