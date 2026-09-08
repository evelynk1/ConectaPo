import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StarRating from '../../components/StarRating'
import { useUser } from '../../context/useUser'
import { getPublication, normalizePublication, obtenerBloquesHorarios, reservarBloqueCliente } from '../../services/api'

export default function Detalle() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user, token } = useUser()

  // Estados principales
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [imagenActiva, setImagenActiva] = useState(null)
  
  // Estados de calendario y reservas
  const [bloques, setBloques] = useState([])
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null)
  const [isReserving, setIsReserving] = useState(false)

  // Carga inicial de datos
  useEffect(() => {
    let active = true

    getPublication(id)
      .then((publication) => {
        if (active) {
          const normalized = normalizePublication(publication)
          setService(normalized)
          setImagenActiva(normalized.image)
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'No fue posible cargar esta publicación.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    obtenerBloquesHorarios(id, token)
      .then(data => {
        if (active) setBloques(data.bloques || [])
      })
      .catch(err => console.error("Error al cargar horarios:", err))

    return () => { active = false }
  }, [id, token])

  // Utilidad para formatear fechas
  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO)
    return `${fecha.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })} a las ${fecha.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}`
  }

  // Lógica de reserva
  const handleReservarBloque = async (bloque) => {
    if (!user) {
      alert("Para reservar un horario, primero debes iniciar sesión en ConectaPo.")
      navigate('/login')
      return
    }

    if (!window.confirm(`¿Confirmas que deseas agendar este servicio para el ${formatearFecha(bloque.fecha_hora_inicio)}?`)) return

    setIsReserving(true)
    try {
      await reservarBloqueCliente(bloque.id, token)
      setBloqueSeleccionado(bloque)
      setBloques(prev => prev.map(b => b.id === bloque.id ? { ...b, estado: 'RESERVADO' } : b))
    } catch (err) {
      alert(err.message || 'Ocurrió un error al intentar reservar.')
    } finally {
      setIsReserving(false)
    }
  }

  // Renderizados condicionales (Carga y Errores)
  if (loading) return <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-slate-500">Cargando publicación...</div>

  if (error || !service) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-slate-600">{error || 'La publicación no fue encontrada.'}</p>
        <button onClick={() => navigate('/galeria')} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold">Volver a la galería</button>
      </div>
    )
  }

  const s = service
  const fotosGaleria = [s.image, s.foto_url_2, s.foto_url_3].filter(Boolean)
  const bloquesDisponibles = bloques.filter(b => b.estado === 'DISPONIBLE' && new Date(b.fecha_hora_inicio) > new Date())
  
  // Generación del enlace dinámico de WhatsApp
  let mensajeBase = `Hola ${s.name}, vi tu publicación "${s.titulo || s.trade}" en ConectaPo y me gustaría cotizar un servicio.`
  if (bloqueSeleccionado) {
    mensajeBase = `Hola ${s.name}, vi tu publicación "${s.titulo || s.trade}" en ConectaPo y acabo de reservar el horario del ${formatearFecha(bloqueSeleccionado.fecha_hora_inicio)} para nuestro servicio.`
  }
  
  const whatsappNumber = String(s.usuario_telefono || '').replace(/\D/g, '')
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensajeBase)}` : null

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      
      {/* Migas de pan */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-xs text-slate-400">
          <button onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors">Inicio</button>
          <span>/</span>
          <button onClick={() => navigate('/galeria')} className="hover:text-blue-600 transition-colors">Servicios</button>
          <span>/</span>
          <span className="text-slate-700 font-medium truncate">{s.titulo || s.trade}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Contenido Principal */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Galería de imágenes */}
            <div className="space-y-3">
              <div className="rounded-3xl overflow-hidden h-72 md:h-[450px] bg-slate-100 relative shadow-sm">
                <img src={imagenActiva} alt={s.titulo || s.trade} className="w-full h-full object-cover transition-opacity duration-300" />
              </div>
              
              {fotosGaleria.length > 1 && (
                <div className="flex items-center gap-3">
                  {fotosGaleria.map((foto, index) => (
                    <button
                      key={index}
                      onClick={() => setImagenActiva(foto)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 focus:outline-none ${
                        imagenActiva === foto ? 'border-blue-600 opacity-100 shadow-md ring-2 ring-blue-100' : 'border-transparent opacity-60 hover:opacity-100 hover:border-slate-300'
                      }`}
                    >
                      <img src={foto} alt={`Vista previa ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cabecera del profesional */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <img src={s.avatar} alt={s.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>{s.titulo || s.trade}</h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white bg-blue-600">✓ Verificado</span>
                  </div>
                  <p className="text-slate-500 text-sm mt-0.5">{s.name} · {s.trade}</p>
                  
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <StarRating rating={s.rating} />
                      <span className="text-sm font-bold text-slate-800">{s.rating}</span>
                      <span className="text-xs text-slate-400">({s.reviews} valorizaciones)</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">📍 {s.comuna}</div>
                  </div>
                </div>
                
                <div className="text-right shrink-0 hidden sm:block">
                  <div className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>{s.price}</div>
                  <div className="text-xs text-slate-400">precio base</div>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h2 className="font-semibold text-slate-900 mb-3">Descripción del servicio</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{s.descripcion || 'Sin descripción detallada.'}</p>
            </div>

          </div>

          {/* Barra Lateral / Sidebar */}
          <div className="space-y-5 lg:sticky lg:top-32">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              
              {/* Tarifa base */}
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>{s.price}</span>
                    <span className="text-xs text-slate-400 ml-1">+ materiales</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online
                  </span>
                </div>
              </div>

              {/* Calendario de Disponibilidad */}
              <div className="p-5 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-700 mb-3">Disponibilidad del servicio</p>
                
                {bloqueSeleccionado ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                    <p className="text-emerald-800 font-bold text-sm mb-1">¡Horario Reservado!</p>
                    <p className="text-emerald-600 text-xs">{formatearFecha(bloqueSeleccionado.fecha_hora_inicio)}</p>
                    <p className="text-emerald-600 text-xs mt-2 font-medium">Presiona el botón de abajo para coordinar con {s.name}.</p>
                  </div>
                ) : bloquesDisponibles.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {bloquesDisponibles.map(bloque => {
                      const f = new Date(bloque.fecha_hora_inicio)
                      return (
                        <button
                          key={bloque.id}
                          disabled={isReserving}
                          onClick={() => handleReservarBloque(bloque)}
                          className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-200 group"
                        >
                          <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider group-hover:text-blue-600">
                            {f.toLocaleDateString('es-CL', { weekday: 'short', day: '2-digit', month: 'short' })}
                          </span>
                          <span className="text-sm font-bold text-slate-800 mt-0.5 group-hover:text-blue-700">
                            {f.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed text-center">
                    {s.disponibilidad || 'Horarios a coordinar directamente con el profesional vía WhatsApp.'}
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="p-5 space-y-3">
                
                {!user ? (
                  /* REGLA 1: No está logueado */
                  <button 
                    onClick={() => navigate('/login')}
                    className="w-full py-3.5 rounded-xl font-semibold text-white text-sm bg-slate-800 hover:bg-slate-700 transition-all shadow-sm"
                  >
                    Inicia sesión para contactar
                  </button>
                ) : (bloquesDisponibles.length > 0 && !bloqueSeleccionado) ? (
                  /* REGLA 2: Hay horarios, pero no ha seleccionado nada */
                  <button 
                    disabled
                    className="w-full py-3.5 rounded-xl font-semibold text-slate-400 text-sm bg-slate-200 cursor-not-allowed"
                  >
                    Selecciona un horario para contactar
                  </button>
                ) : whatsappUrl ? (
                  /* REGLA 3: Logueado y con horario seleccionado (o sin calendario) */
                  <a 
                    href={whatsappUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 hover:shadow-lg bg-[#25D366]"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Contactar por WhatsApp
                  </a>
                ) : (
                  /* Si el profesional no registró teléfono */
                  <p className="w-full py-3.5 rounded-xl text-center bg-slate-100 text-slate-500 text-sm">
                    Este profesional no ha registrado un teléfono.
                  </p>
                )}
                
                <button onClick={() => navigate('/galeria')} className="w-full py-2.5 rounded-xl text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                  ← Volver a la galería
                </button>
              </div>
            </div>

            {/* Información adicional del servicio */}
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">Información adicional</h3>
              <div className="space-y-2.5">
                {[
                  ['📅', 'Tiempo de respuesta', 'Respuesta rápida'],
                  ['🏅', 'Experiencia', `${s.anos_experiencia || 0} años`],
                  ['📍', 'Comuna', s.comuna || 'No especificada'],
                  ['⚡', 'Modalidad', s.es_horario_conversable ? 'Horario conversable' : 'Definido'],
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