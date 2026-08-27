import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SERVICES } from '../../data/services'
import StarRating from '../../components/StarRating'

export default function Detalle() {
  const navigate = useNavigate()
  const s = SERVICES[0]
  const [selectedSlot, setSelectedSlot] = useState(null)

  const slots = [
    { day: 'Lun 11', times: ['09:00', '11:00', '15:00'] },
    { day: 'Mar 12', times: ['10:00', '14:00', '16:00'] },
    { day: 'Mié 13', times: ['09:00', '13:00'] },
    { day: 'Jue 14', times: ['11:00', '15:00', '17:00'] },
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      
      {/* ------------------------------------------------------------------ */}
      {/* MIGAS DE PAN (Breadcrumbs)                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-xs text-slate-400">
          <button onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors">Inicio</button>
          <span>/</span>
          <button onClick={() => navigate('/galeria')} className="hover:text-blue-600 transition-colors">Servicios</button>
          <span>/</span>
          <span className="text-slate-700 font-medium">{s.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Columna Izquierda: Imagen, Información principal y Descripción */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Imagen destacada del servicio */}
            <div className="rounded-3xl overflow-hidden h-72 md:h-96 bg-slate-100 relative">
              <img src={s.image} alt={s.trade} className="w-full h-full object-cover" />
            </div>

            {/* Cabecera del profesional */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <img src={s.avatar} alt={s.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                      {s.name}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: '#2563EB' }}>✓ Verificado</span>
                  </div>
                  <p className="text-slate-500 text-sm mt-0.5">{s.trade}</p>
                  
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {/* Estrellas y valorización */}
                    <div className="flex items-center gap-1.5">
                      <StarRating rating={s.rating} />
                      <span className="text-sm font-bold text-slate-800">{s.rating}</span>
                      <span className="text-xs text-slate-400">({s.reviews} valorizaciones)</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {s.comuna}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 hidden sm:block">
                  <div className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>{s.price}</div>
                  <div className="text-xs text-slate-400">precio base</div>
                </div>
              </div>
            </div>

            {/* Descripción detallada y garantías */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="font-semibold text-slate-900 mb-3">Descripción del servicio</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Gasfitero certificado con más de 12 años de experiencia atendiendo el sector residencial y comercial en la Región Metropolitana. Ofrezco servicio de urgencias 24/7, instalación de artefactos sanitarios, detección y reparación de fugas, instalación de cañerías y sistemas de calefacción. Todos los trabajos incluyen garantía escrita de 90 días.
              </p>
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  ['✓', 'Garantía 90 días'], 
                  ['⚡', 'Respuesta rápida'], 
                  ['🏅', 'Certificado'], 
                  ['🔒', 'Asegurado']
                ].map(([icon, text]) => (
                  <div key={text} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-blue-50 text-center">
                    <span className="text-lg">{icon}</span>
                    <span className="text-xs font-medium text-blue-800">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sección exclusiva de estrellas */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Valorización general de clientes</h3>
                <p className="text-xs text-slate-400 mt-0.5">Basado en contratos completados exitosamente en la plataforma</p>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                <span className="text-2xl font-extrabold text-slate-900">{s.rating}</span>
                <div>
                  <StarRating rating={s.rating} />
                  <span className="text-[11px] text-slate-500 font-medium">{s.reviews} calificaciones positivas</span>
                </div>
              </div>
            </div>

          </div>

          {/* ------------------------------------------------------------------ */}
          {/* BARRA LATERAL (Sidebar FIJO con agenda y botón de WhatsApp)         */}
          {/* ------------------------------------------------------------------ */}
          <div className="space-y-5 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>{s.price}</span>
                    <span className="text-xs text-slate-400 ml-1">+ materiales</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Online
                  </span>
                </div>
              </div>

              {/* Selector de horarios */}
              <div className="p-5 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-700 mb-3">Horarios disponibles — Agosto 2026</p>
                <div className="grid grid-cols-2 gap-3">
                  {slots.map(slot => (
                    <div key={slot.day} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-slate-600 border-b border-slate-200 pb-1">{slot.day}</span>
                      <div className="flex flex-col gap-1">
                        {slot.times.map(t => (
                          <button key={t} onClick={() => setSelectedSlot(`${slot.day} ${t}`)}
                            className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold transition-all text-center ${selectedSlot === `${slot.day} ${t}` ? 'text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200'}`}
                            style={selectedSlot === `${slot.day} ${t}` ? { background: '#2563EB' } : {}}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {selectedSlot && (
                  <div className="mt-3 px-3 py-2 rounded-lg bg-blue-50 text-xs text-blue-800 font-medium text-center">
                    ✓ Seleccionado: {selectedSlot}
                  </div>
                )}
              </div>

              {/* Acciones principales */}
              <div className="p-5 space-y-3">
                <a href="https://wa.me/56987654321?text=Hola%20Carlos,%20vi%20tu%20perfil%20en%20ConectaPo%20y%20me%20gustar%C3%ADa%20cotizar%20un%20servicio."
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 hover:shadow-lg"
                  style={{ background: '#25D366' }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Contactar por WhatsApp
                </a>
                {/* Botón corregido usando useNavigate de React Router */}
                <button onClick={() => navigate('/galeria')} className="w-full py-2.5 rounded-xl text-xs text-slate-400 hover:text-slate-600 transition-colors">
                  ← Volver a la galería
                </button>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">Información adicional</h3>
              <div className="space-y-2.5">
                {[
                  ['📅', 'Tiempo de respuesta', '< 1 hora'],
                  ['🏅', 'Proyectos completados', '312'],
                  ['📍', 'Área de cobertura', 'RM completa'],
                  ['⏰', 'Horario', '7:00 – 21:00'],
                ].map(([icon, label, val]) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-blue-700">
                      <span>{icon}</span> {label}
                    </span>
                    <span className="font-semibold text-blue-900">{val}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}