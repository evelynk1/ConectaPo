import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export default function GestionCalendario() {
  const navigate = useNavigate()
  const [currentMonth, setCurrentMonth] = useState('Agosto 2026')
  const [selectedDate, setSelectedDate] = useState(24)
  const [availabilityStatus, setAvailabilityStatus] = useState('disponible')
  const [saved, setSaved] = useState(false)

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
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

          {/* Calendario (Activo actual con borde azul destacado) */}
          <div className="w-full flex items-center gap-3 p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 shadow-sm text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl shrink-0">📅</div>
            <div>
              <p className="text-xs font-bold text-blue-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Mi Calendario</p>
              <p className="text-[11px] text-blue-600">Gestionar disponibilidad</p>
            </div>
          </div>

          {/* Tickets */}
          <button 
            onClick={() => navigate('/panel/tickets')}
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 hover:border-orange-200 hover:bg-orange-50/40 hover:shadow-sm transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl shrink-0">🎫</div>
            <div>
              <p className="text-xs font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Soporte / Tickets</p>
              <p className="text-[11px] text-slate-500">Crear nuevo ticket</p>
            </div>
          </button>
        </div>

        {/* COLUMNA DERECHA: Contenido Principal de Calendario */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Encabezado */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs font-extrabold tracking-widest uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Disponibilidad
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                Gestión de Calendario
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Configura tus días libres y horarios de atención para el agendamiento.
              </p>
            </div>
            {saved && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-xs font-semibold animate-pulse">
                ✅ Cambios guardados
              </div>
            )}
          </div>

          {/* Panel interno dividido */}
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Calendario visual */}
            <div className="md:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                  {currentMonth}
                </h2>
                <div className="flex gap-2">
                  <button className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all font-bold">‹</button>
                  <button className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all font-bold">›</button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center">
                {DAYS_OF_WEEK.map(day => (
                  <div key={day} className="text-xs font-bold text-slate-400 uppercase tracking-wider py-1">
                    {day}
                  </div>
                ))}

                <div className="h-10"></div>
                <div className="h-10"></div>
                <div className="h-10"></div>

                {daysInMonth.map(day => {
                  const isSelected = selectedDate === day
                  const isBusy = day === 10 || day === 15 || day === 22

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(day)}
                      className={`h-10 rounded-xl text-sm font-semibold transition-all flex items-center justify-center relative ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                          : isBusy
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100'
                      }`}
                    >
                      {day}
                      {isBusy && !isSelected && (
                        <span className="absolute bottom-1 w-1 h-1 rounded-full bg-amber-500"></span>
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-600"></span><span>Seleccionado</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-400"></span><span>Con reservas</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-200"></span><span>Disponible</span></div>
              </div>
            </div>

            {/* Configuración del día */}
            <div className="md:col-span-1 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Día seleccionado</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                    {selectedDate} de Agosto, 2026
                  </h3>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Estado del día</label>
                  {[
                    ['disponible', '🟢 Disponible', 'Horario normal'],
                    ['parcial', '🟡 Parcial', 'Bloques específicos'],
                    ['no-disponible', '🔴 No disponible', 'Día libre']
                  ].map(([val, label, desc]) => (
                    <button
                      key={val}
                      onClick={() => setAvailabilityStatus(val)}
                      className={`w-full text-left p-3 rounded-2xl border-2 transition-all ${
                        availabilityStatus === val
                          ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                          : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{desc}</div>
                    </button>
                  ))}
                </div>

                {availabilityStatus !== 'no-disponible' && (
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Horario</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="time" defaultValue="09:00" className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 outline-none focus:border-blue-500" />
                      <input type="time" defaultValue="18:00" className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 outline-none focus:border-blue-500" />
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleSave}
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-95 shadow-md"
                style={{ background: '#2563EB' }}
              >
                Guardar disponibilidad
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}