import AppRouter from './router/AppRouter';

function App() {
  return <AppRouter />;
}

export default App;
// import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
// import DashboardAdmin from './pages/admin/DashboardAdmin'
// import GestionOficios from './pages/admin/GestionOficios'
// import GestionUbicaciones from './pages/admin/GestionUbicaciones'
// import ResolucionTickets from './pages/admin/ResolucionTickets'

// export default function App() {
//   return (
//     <BrowserRouter>
//       <div className="min-h-screen bg-slate-100 flex flex-col">
//         {/* Barra superior de navegación con Links de React Router */}
//         <header className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
//           <div className="flex items-center gap-3">
//             <span className="font-bold text-sm tracking-wide text-orange-400">Panel de Control Admin</span>
//           </div>
//           <nav className="flex gap-2 flex-wrap">
//             <Link 
//               to="/"
//               className="px-4 py-1.5 rounded-xl text-xs font-semibold transition-all bg-slate-800 text-slate-300 hover:bg-slate-700"
//             >
//               Dashboard Admin
//             </Link>
//             <Link 
//               to="/admin/oficios"
//               className="px-4 py-1.5 rounded-xl text-xs font-semibold transition-all bg-slate-800 text-slate-300 hover:bg-slate-700"
//             >
//               Gestión Oficios
//             </Link>
//             <Link 
//               to="/admin/ubicaciones"
//               className="px-4 py-1.5 rounded-xl text-xs font-semibold transition-all bg-slate-800 text-slate-300 hover:bg-slate-700"
//             >
//               Gestión Ubicaciones
//             </Link>
//             <Link 
//               to="/admin/tickets"
//               className="px-4 py-1.5 rounded-xl text-xs font-semibold transition-all bg-slate-800 text-slate-300 hover:bg-slate-700"
//             >
//               Resolución Tickets
//             </Link>
//           </nav>
//         </header>

//         {/* Contenedor principal de rutas */}
//         <main className="flex-1 overflow-auto">
//           <Routes>
//             <Route path="/" element={<DashboardAdmin />} />
//             <Route path="/admin/oficios" element={<GestionOficios />} />
//             <Route path="/admin/ubicaciones" element={<GestionUbicaciones />} />
//             <Route path="/admin/tickets" element={<ResolucionTickets />} />
//           </Routes>
//         </main>
//       </div>
//     </BrowserRouter>
//   )
// }import { useState } from 'react'