import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const PublicLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">

            {/* Barra de navegación */}
            <Navbar />

            {/* Contenido de la página */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Pie de página */}
            <Footer />

        </div>
    )
}

export default PublicLayout