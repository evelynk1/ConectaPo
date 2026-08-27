import { useNavigate } from 'react-router-dom'

// Datos simulados para las estadísticas del dashboard 
const STATS = [
    { label: 'Usuarios totales', value: '3.842', delta: '+12%', icon: '👥', color: '#2563EB' },
    { label: 'Tickets pendientes', value: '47', delta: '+5', icon: '🎫', color: '#F97316' },
    { label: 'Servicios activos', value: '1.204', delta: '+8%', icon: '🔧', color: '#10B981' },
]

// Datos simulados para los tickets recientes de usuarios 
const RECENT_TICKETS = [
    { id: 'TK-001', user: 'María González', issue: 'Error al cargar imagen de perfil', status: 'abierto', priority: 'alta', date: '24/08/2026' },
    { id: 'TK-002', user: 'Pedro Vega', issue: 'Perfil verificación pendiente', status: 'en_proceso', priority: 'media', date: '23/08/2026' },
    { id: 'TK-003', user: 'Ana Torres', issue: 'Reseña inapropiada reportada', status: 'resuelto', priority: 'baja', date: '22/08/2026' },
    { id: 'TK-004', user: 'Carlos Mendoza', issue: 'No puede actualizar contraseña', status: 'abierto', priority: 'media', date: '22/08/2026' },
    { id: 'TK-005', user: 'Valentina Ruiz', issue: 'Disputa con cliente en servicio', status: 'en_proceso', priority: 'alta', date: '21/08/2026' },
]

// Datos simulados para los usuarios nuevos
const RECENT_USERS = [
    { name: 'Jorge Herrera', role: 'Profesional', trade: 'Electricista', joined: 'Hoy', avatar: 'JH' },
    { name: 'Claudia Morales', role: 'Cliente', trade: '—', joined: 'Ayer', avatar: 'CM' },
    { name: 'Felipe Rojas', role: 'Profesional', trade: 'Carpintero', joined: '22/08', avatar: 'FR' },
    { name: 'Sofía Navarro', role: 'Cliente', trade: '—', joined: '21/08', avatar: 'SN' },
]

// Utilidades para los estilos de los badges
const STATUS_BADGE = {
    abierto: 'bg-red-100 text-red-700',
    en_proceso: 'bg-amber-100 text-amber-700',
    resuelto: 'bg-emerald-100 text-emerald-700',
}

const STATUS_LABEL = {
    abierto: 'Abierto',
    en_proceso: 'En proceso',
    resuelto: 'Resuelto',
}

const PRIORITY_BADGE = {
    alta: 'bg-red-50 text-red-600 border border-red-200',
    media: 'bg-amber-50 text-amber-600 border border-amber-200',
    baja: 'bg-slate-100 text-slate-500',
}

export default function DashboardAdmin() {
    const navigate = useNavigate()

    return (
        <div className="p-6 space-y-6 bg-slate-100 min-h-full">
            {/* Título de la vista */}
            <div>
                <h1 className="text-2xl font-extrabold text-slate-950" style={{ fontFamily: 'Plus Jakarta Sans' }}>Panel de Administración</h1>
                <p className="text-sm text-slate-600 mt-1">Supervisa los reportes de usuarios, oficios y la plataforma.</p>
            </div>

            {/* Sección de Tarjetas de Estadísticas (Ajustado a 3 columnas) */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {STATS.map((s) => (
                    <article key={s.label} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: `${s.color}15` }}>
                                {s.icon}
                            </div>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                                {s.delta}
                            </span>
                        </div>
                        <p className="text-3xl font-extrabold text-slate-950" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                            {s.value}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">{s.label}</p>
                    </article>
                ))}
            </section>

            {/* Sección principal: Tickets de Usuarios y Registros */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Tabla de Tickets de Soporte */}
                <article className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between gap-4 px-7 py-5 border-b border-slate-100">
                        <div>
                            <h2 className="font-bold text-slate-950 text-lg">Tickets de soporte de usuarios</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Reportes y solicitudes enviados por la comunidad</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50/50 text-slate-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-7 py-4 text-left font-semibold">ID</th>
                                    <th className="px-7 py-4 text-left font-semibold">Usuario</th>
                                    <th className="px-7 py-4 text-left font-semibold">Problema</th>
                                    <th className="px-7 py-4 text-left font-semibold">Prioridad</th>
                                    <th className="px-7 py-4 text-left font-semibold">Estado</th>
                                    <th className="px-7 py-4 text-left font-semibold">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {RECENT_TICKETS.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-7 py-5 font-mono font-medium text-blue-600">{t.id}</td>
                                        <td className="px-7 py-5 font-semibold text-slate-800">{t.user}</td>
                                        <td className="px-7 py-5 text-slate-600 max-w-[200px] truncate">{t.issue}</td>
                                        <td className="px-7 py-5">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${PRIORITY_BADGE[t.priority]}`}>
                                                {t.priority}
                                            </span>
                                        </td>
                                        <td className="px-7 py-5">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_BADGE[t.status]}`}>
                                                {STATUS_LABEL[t.status]}
                                            </span>
                                        </td>
                                        <td className="px-7 py-5">
                                            <button
                                                onClick={() => navigate('/admin/tickets')}
                                                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                                            >
                                                Gestionar →
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </article>

                {/* Lista de Nuevos Usuarios */}
                <article className="bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <div className="px-7 py-5 border-b border-slate-100">
                        <h2 className="font-bold text-slate-950 text-lg">Nuevos registros</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Usuarios creados recientemente</p>
                    </div>
                    <div className="p-6 space-y-5">
                        {RECENT_USERS.map((u) => (
                            <div key={u.name} className="flex items-center gap-4 p-2 rounded-2xl hover:bg-slate-50 transition-colors">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-inner">
                                    {u.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-800 truncate">{u.name}</p>
                                    <p className="text-xs text-slate-500">
                                        {u.role} {u.trade !== '—' ? `· ${u.trade}` : ''}
                                    </p>
                                </div>
                                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full shrink-0">{u.joined}</span>
                            </div>
                        ))}
                    </div>
                </article>
            </section>

            {/* Accesos Rápidos Exclusivos de Administración */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 max-w-2xl">
                {[
                    { label: 'Gestionar oficios', desc: 'Administrar categorías y oficios disponibles', icon: '🔧', path: '/admin/oficios', color: '#2563EB' },
                    { label: 'Gestionar ubicaciones', desc: 'Configurar regiones, comunas y zonas', icon: '📍', path: '/admin/ubicaciones', color: '#10B981' },
                ].map((a) => (
                    <button
                        key={a.label}
                        onClick={() => navigate(a.path)}
                        className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-left group flex items-start gap-4"
                    >
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                            style={{ background: `${a.color}15` }}
                        >
                            {a.icon}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-950">{a.label}</p>
                            <p className="text-xs text-slate-500 mt-1">{a.desc}</p>
                            <p className="text-xs text-blue-600 mt-2.5 group-hover:underline font-semibold">Acceder →</p>
                        </div>
                    </button>
                ))}
            </section>
        </div>
    )
}