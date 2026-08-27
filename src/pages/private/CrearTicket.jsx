import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const CATEGORIES = [
  'Verificación de cuenta', 
  'Reporte de usuario',
  'Error técnico', 
  'Disputa de servicio', 
  'Solicitud de eliminación',
  'Consulta general', 
  'Otro'
]

export default function CrearTicket() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [form, setForm] = useState({ 
    user: '', 
    email: '', 
    category: '', 
    subject: '', 
    description: '' 
  })
  
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => { 
    if (!form.user || !form.category || !form.subject) return; 
    setSubmitted(true) 
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* COLUMNA IZQUIERDA: Menú de navegación al lado */}
        <div className="lg:col-span-1 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
            Navegación
          </div>

          {/* Perfil */}
          <button 
            onClick={() => navigate('/panel/perfil')}
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">👤</div>
            <div>
              <p className="text-xs font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Mi Perfil</p>
              <p className="text-[11px] text-slate-500">Ver información</p>
            </div>
          </button>

          {/* Calendario */}
          <button 
            onClick={() => navigate('/panel/calendario')}
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-sm transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl shrink-0">📅</div>
            <div>
              <p className="text-xs font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Mi Calendario</p>
              <p className="text-[11px] text-slate-500">Gestionar disponibilidad</p>
            </div>
          </button>

          {/* Tickets (Activo actual con borde naranja destacado) */}
          <div className="w-full flex items-center gap-3 p-4 rounded-2xl bg-orange-50 border-2 border-orange-200 shadow-sm text-left">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl shrink-0">🎫</div>
            <div>
              <p className="text-xs font-bold text-orange-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Soporte / Tickets</p>
              <p className="text-[11px] text-orange-600">Crear nuevo ticket</p>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Formulario Principal */}
        <div className="lg:col-span-3">
          {submitted ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-4xl mx-auto mb-6">✅</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>Ticket creado</h2>
              <p className="text-slate-500 text-sm mb-2">El ticket ha sido registrado exitosamente.</p>
              <p className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl inline-block mb-8">TK-{String(Date.now()).slice(-4)}</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setSubmitted(false)} className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all" style={{ background: '#F97316' }}>Crear otro</button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100" style={{ background: 'linear-gradient(135deg, #F97316, #fb923c)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🎫</div>
                  <div>
                    <p className="text-white font-bold" style={{ fontFamily: 'Plus Jakarta Sans' }}>Nuevo ticket de soporte</p>
                    <p className="text-orange-100 text-xs">Completa todos los campos requeridos</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nombre del usuario *</label>
                    <input value={form.user} onChange={e => setForm({ ...form, user: e.target.value })}
                      placeholder="Juan Pérez"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Correo del usuario</label>
                    <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      type="email" placeholder="juan@ejemplo.cl"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Categoría *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer bg-white">
                    <option value="">Seleccionar categoría</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Asunto del ticket *</label>
                  <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                    placeholder="Describe brevemente el problema..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Descripción detallada</label>
                  <textarea rows={5} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Proporciona todos los detalles relevantes..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all resize-none" />
                </div>

                {/* Subir archivos (Se usará más adelante) */}
                {/* 
                <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-slate-200 cursor-pointer hover:border-orange-300 hover:bg-orange-50/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl shrink-0">📎</div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Subir archivos</p>
                    <p className="text-xs text-slate-400">PNG, JPG, PDF hasta 10 MB</p>
                  </div>
                  <input type="file" multiple className="hidden" />
                </label> 
                */}

                <div className="flex gap-3 pt-2">
                  <button onClick={handleSubmit}
                    className="flex-1 py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:shadow-lg"
                    style={{ background: '#F97316' }}>
                    Crear ticket
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}