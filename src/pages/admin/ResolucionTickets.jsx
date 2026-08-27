import { useState } from 'react'
import { useNavigate } from 'react-router-dom' 

const INITIAL_TICKETS = [
  { 
    id: 'TK-001', 
    user: 'María González', 
    email: 'maria@example.com', 
    issue: 'Error al cargar imagen de perfil', 
    description: 'Intenté subir mi foto de perfil pero la página se queda cargando y nunca se actualiza.', 
    status: 'abierto', 
    priority: 'alta', 
    date: '24/08/2026' 
  },
  { 
    id: 'TK-002', 
    user: 'Pedro Vega', 
    email: 'pedro@example.com', 
    issue: 'Perfil verificación pendiente', 
    description: 'Subí mis antecedentes hace 3 días y mi cuenta sigue apareciendo sin verificar.', 
    status: 'en_proceso', 
    priority: 'media', 
    date: '23/08/2026' 
  },
  { 
    id: 'TK-003', 
    user: 'Ana Torres', 
    email: 'ana@example.com', 
    issue: 'Reseña inapropiada reportada', 
    description: 'Un cliente dejó un comentario ofensivo en mi perfil que no tiene relación con el trabajo realizado.', 
    status: 'resuelto', 
    priority: 'baja', 
    date: '22/08/2026' 
  },
]

export default function ResolucionTickets() {
  const navigate = useNavigate() // 👈 Activamos el hook de navegación
  const [tickets, setTickets] = useState(INITIAL_TICKETS)
  const [selectedTicket, setSelectedTicket] = useState(INITIAL_TICKETS[0])
  const [adminResponse, setAdminResponse] = useState('')

  const handleStatusChange = (newStatus) => {
    const updated = tickets.map(t => t.id === selectedTicket.id ? { ...t, status: newStatus } : t)
    setTickets(updated)
    setSelectedTicket({ ...selectedTicket, status: newStatus })
  }

  const handleSendResponse = (e) => {
    e.preventDefault()
    if (!adminResponse.trim()) return
    alert(`Respuesta enviada a ${selectedTicket.email}: "${adminResponse}"`)
    setAdminResponse('')
    handleStatusChange('resuelto')
  }

  return (
    <div className="p-6 space-y-6 bg-slate-100 min-h-full">
      {/* Cabecera y migas de pan */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            {/* Arreglado con navigate para ir a la ruta del admin */}
            <button onClick={() => navigate('/admin')} className="hover:text-blue-600 transition-colors">Dashboard</button>
            <span>/</span>
            <span className="text-slate-800 font-medium">Resolución de Tickets</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-950" style={{ fontFamily: 'Plus Jakarta Sans' }}>Bandeja de Soporte</h1>
          <p className="text-sm text-slate-600 mt-0.5">Gestiona, responde y da cierre a los reportes de los usuarios.</p>
        </div>
        
        {/* Botón de volver arreglado con navigate */}
        <button
          onClick={() => navigate('/admin')}
          className="self-start sm:self-auto px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
        >
          ← Volver al Dashboard
        </button>
      </div>

      {/* Panel principal dividido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lista lateral de tickets */}
        <article className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-3 h-fit">
          <h2 className="font-bold text-slate-950 px-3 text-base">Tickets ({tickets.length})</h2>
          <div className="space-y-2">
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${selectedTicket.id === t.id ? 'bg-blue-50/50 border-blue-200 shadow-sm' : 'bg-white border-transparent hover:bg-slate-50'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-blue-600">{t.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    t.status === 'abierto' ? 'bg-red-100 text-red-700' :
                    t.status === 'en_proceso' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {t.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="font-bold text-sm text-slate-800 truncate">{t.issue}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t.user}</p>
              </div>
            ))}
          </div>
        </article>

        {/* Detalle y área de respuesta */}
        <article className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
          {selectedTicket ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600">{selectedTicket.id}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">{selectedTicket.date}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-950 mt-1">{selectedTicket.issue}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Reportado por: <span className="font-semibold text-slate-700">{selectedTicket.user}</span> ({selectedTicket.email})</p>
                </div>

                {/* Selector rápido de estado */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Estado:</span>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white cursor-pointer outline-none focus:border-blue-500"
                  >
                    <option value="abierto">Abierto</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="resuelto">Resuelto</option>
                  </select>
                </div>
              </div>

              {/* Descripción del problema */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Descripción del usuario</p>
                <p className="text-sm text-slate-700 leading-relaxed">{selectedTicket.description}</p>
              </div>

              {/* Formulario para responder */}
              <form onSubmit={handleSendResponse} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Responder al usuario</label>
                  <textarea
                    rows="4"
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="Escribe una respuesta o solución para este ticket..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-95 shadow-sm cursor-pointer"
                    style={{ background: '#2563EB' }}
                  >
                    Enviar respuesta y cerrar
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-16 text-slate-400">
              Selecciona un ticket de la izquierda para ver los detalles.
            </div>
          )}
        </article>

      </div>
    </div>
  )
}