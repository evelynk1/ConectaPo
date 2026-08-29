import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; // <-- se importa el Navbar

export default function PrivateLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {/* Se agrega el header para que el usuario pueda navegar y desloguearse */}
            <header>
                <Navbar />
            </header>

            <main className="flex-grow w-full p-6">
                <Outlet />
            </main>
        </div>
    );
}