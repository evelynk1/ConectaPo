import { Outlet } from 'react-router-dom';

export default function PrivateLayout() {
    return (
        <div className="min-h-screen bg-slate-50">
            
            <main className="w-full">
                <Outlet />
            </main>
        </div>
    );
}