import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom' 
import { useUser } from '../../context/useUser'
import { getTickets } from '../../services/api'

export default function ResolucionTickets() {
  const navigate = useNavigate()
  const { token } = useUser()
  const [tickets, setTickets] = useState([])
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [adminResponse, setAdminResponse] = useState('')
  const [loading, setLoading] = useState(true)

  // Cargar los tickets reales desde la API al montar el componente
  useEffect(() => {
    getTickets(token)
      .then(data => {
        const rawTickets = Array.isArray(data) ? data : data.tickets || []
        
        // Mapeamos los datos de la API a la estructura que usa la vista
        const formatted = rawTickets.map(t => ({
          id: `TK-${t.id || t.ticket_id || '000'}`,
          user: t.nombre_usuario || t.user || 'Usuario Anónimo',
          email: t.email || t.correo || 'Sin correo',
          issue: t.mensaje || t.issue || 'Reporte de soporte',
          description: t.descripcion || t.description || t.mensaje || 'Sin descripción detallada.',
          status: t.estado || 'abierto',
          priority: t.prioridad || 'media',
          date: t.created_at ? new Date(t.created_at).toLocaleDateString() : 'Hoy'
        }))

        setTickets(formatted)
        if (formatted.length > 0) {
          setSelectedTicket(formatted[0])
        }
      })
      .catch((error) => {
        console.error("Error al cargar los tickets:", error)
        setTickets([])
      })
      .finally(() => setLoading(false))
  }, [token])

  const handleStatusChange = (newStatus) => {
    if (!selectedTicket) return
    const updated = tickets.map(t => t.id === selectedTicket.id ? { ...t, status: newStatus } : t)
    setTickets(updated)
    setSelectedTicket({ ...selectedTicket, status: newStatus })
  }

  const handleSendResponse = (e) => {
    e.preventDefault()
    if (!adminResponse.trim() || !selectedTicket) return
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
            <button onClick={() => navigate('/admin')} className="hover:text-blue-600 transition-colors cursor-pointer">Dashboard</button>
            <span>/</span>
            <span className="text-slate-800 font-medium">Resolución de Tickets</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-950" style={{ fontFamily: 'Plus Jakarta Sans' }}>Bandeja de Soporte</h1>
          <p className="text-sm text-slate-600 mt-0.5">Gestiona, responde y da cierre a los reportes de los usuarios.</p>
        </div>
        
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
            {loading ? (
              <p className="text-xs text-slate-400 text-center py-8">Cargando tickets...</p>
            ) : tickets.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No hay tickets registrados.</p>
            ) : (
              tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${selectedTicket?.id === t.id ? 'bg-blue-50/50 border-blue-200 shadow-sm' : 'bg-white border-transparent hover:bg-slate-50'}`}
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
              ))
            )}
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
              {loading ? 'Cargando tickets...' : 'Selecciona un ticket de la izquierda para ver los detalles.'}
            </div>
          )}
        </article>

      </div>
    </div>
  )
}