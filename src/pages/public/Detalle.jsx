import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StarRating from '../../components/StarRating'
import { getPublication, normalizePublication } from '../../services/api'

export default function Detalle() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // 📸 NUEVO: Estado para manejar qué imagen se está viendo en grande
  const [imagenActiva, setImagenActiva] = useState(null)

  useEffect(() => {
    let active = true

    getPublication(id)
      .then((publication) => {
        if (active) {
          const normalized = normalizePublication(publication)
          setService(normalized)
          // Seteamos la imagen principal por defecto al cargar
          setImagenActiva(normalized.image)
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'No fue posible cargar esta publicación.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [id])

  if (loading) {
    return <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-slate-500">Cargando publicación...</div>
  }

  if (error || !service) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-slate-600">{error || 'La publicación no fue encontrada.'}</p>
        <button onClick={() => navigate('/galeria')} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold">Volver a la galería</button>
      </div>
    )
  }

  const s = service
  const whatsappNumber = String(s.usuario_telefono || '').replace(/\D/g, '')
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hola ${s.name}, vi tu publicación "${s.titulo || s.trade}" en ConectaPo y me gustaría cotizar un servicio.`)}`
    : null

  // 📸 NUEVO: Agrupamos las fotos. Usamos filter(Boolean) para eliminar los null si el profesional subió solo 1 o 2 fotos.
  const fotosGaleria = [s.image, s.foto_url_2, s.foto_url_3].filter(Boolean)

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      
      {/* MIGAS DE PAN (Breadcrumbs) */}
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
          
          {/* Columna Izquierda: Imagen, Información principal, Descripción y Estrellas */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 📸 NUEVO: Galería interactiva */}
            <div className="space-y-3">
              {/* Imagen Grande */}
              <div className="rounded-3xl overflow-hidden h-72 md:h-[450px] bg-slate-100 relative shadow-sm">
                <img 
                  src={imagenActiva} 
                  alt={s.titulo || s.trade} 
                  className="w-full h-full object-cover transition-opacity duration-300" 
                />
              </div>
              
              {/* Miniaturas (Se muestran solo si hay más de 1 foto) */}
              {fotosGaleria.length > 1 && (
                <div className="flex items-center gap-3">
                  {fotosGaleria.map((foto, index) => (
                    <button
                      key={index}
                      onClick={() => setImagenActiva(foto)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 focus:outline-none ${
                        imagenActiva === foto 
                          ? 'border-blue-600 opacity-100 shadow-md ring-2 ring-blue-100' 
                          : 'border-transparent opacity-60 hover:opacity-100 hover:border-slate-300'
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
                    <h1 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                      {s.titulo || s.trade}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: '#2563EB' }}>✓ Verificado</span>
                  </div>
                  <p className="text-slate-500 text-sm mt-0.5">{s.name} · {s.trade}</p>
                  
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
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
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {s.descripcion || 'El profesional aún no ha agregado una descripción para este servicio.'}
              </p>
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  ['🏅', `${s.anos_experiencia || 0} años de experiencia`],
                  ['⚡', s.es_horario_conversable ? 'Horario conversable' : 'Horario definido'],
                  ['👤', s.name],
                  ['📍', s.comuna]
                ].map(([icon, text]) => (
                  <div key={text} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-blue-50 text-center">
                    <span className="text-lg">{icon}</span>
                    <span className="text-xs font-medium text-blue-800">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sistema de estrellas y valorizaciones detalladas */}
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

          {/* BARRA LATERAL (Sidebar FIJO que incluye precio, disponibilidad y botones) */}
          <div className="space-y-5 lg:sticky lg:top-32">
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

              {/* Cuadro de disponibilidad del servicio */}
              <div className="p-5 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-700 mb-2">Disponibilidad del servicio</p>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                  {s.disponibilidad || 'Horarios a coordinar directamente con el profesional vía WhatsApp.'}
                </div>
              </div>

              {/* Acciones principales */}
              <div className="p-5 space-y-3">
                {whatsappUrl ? (
                  <a 
                    href={whatsappUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 hover:shadow-lg"
                    style={{ background: '#25D366' }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Contactar por WhatsApp
                  </a>
                ) : (
                  <p className="w-full py-3.5 rounded-xl text-center bg-slate-100 text-slate-500 text-sm">
                    Este profesional no ha registrado un teléfono de contacto.
                  </p>
                )}
                
                <button onClick={() => navigate('/galeria')} className="w-full py-2.5 rounded-xl text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                  ← Volver a la galería
                </button>
              </div>
            </div>

            {/* Información adicional del usuario/servicio */}
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