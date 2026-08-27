import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CATEGORIES, SERVICES } from '../../data/services'
import StarRating from '../../components/StarRating'

export default function Galeria() {
  const navigate = useNavigate()
  const location = useLocation()

  // Efecto para hacer scroll automático al cargar la vista si viene con hash o ruta de galería
  useEffect(() => {
    if (location.hash === '#galeria' || location.pathname) {
      const elemento = document.getElementById('galeria')
      if (elemento) {
        elemento.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }, [location])

  // Estados para los filtros de búsqueda, categoría, comuna y ordenamiento
  const [search, setSearch] = useState('')
  const [categoria, setCategoria] = useState('')
  const [comuna, setComuna] = useState('')
  const [sort, setSort] = useState('rating')

  // Lógica para filtrar y ordenar los servicios según los inputs del usuario
  const filteredServices = SERVICES.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.trade.toLowerCase().includes(search.toLowerCase())
    const matchesCategoria = categoria === '' || s.trade === categoria || s.category === categoria
    const matchesComuna = comuna === '' || s.comuna === comuna
    return matchesSearch && matchesCategoria && matchesComuna
  }).sort((a, b) => {
    if (sort === 'rating') return b.rating - a.rating
    if (sort === 'reviews') return b.reviews - a.reviews
    if (sort === 'price') return parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, ''))
    return 0
  })

  return (
    <div id="galeria" className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Encabezado de la galería */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Directorio</p>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Galería de profesionales</h1>
          <p className="text-slate-500 text-sm mt-1">{filteredServices.length} profesionales disponibles</p>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* BARRA DE FILTROS Y BÚSQUEDA                                        */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
          
          {/* Input de búsqueda por texto */}
          <div className="flex items-center gap-2 flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar oficio o nombre..."
              className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none" />
          </div>

          {/* Selector de categoría */}
          <select value={categoria} onChange={e => setCategoria(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm text-slate-600 outline-none cursor-pointer">
            <option value="">Todas las categorías</option>
            {CATEGORIES.map(c => <option key={c.label} value={c.label}>{c.icon} {c.label}</option>)}
          </select>

          {/* Selector de comuna */}
          <select value={comuna} onChange={e => setComuna(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm text-slate-600 outline-none cursor-pointer">
            <option value="">Toda Chile</option>
            {['Providencia', 'Las Condes', 'Ñuñoa', 'Santiago', 'Maipú', 'Vitacura'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Selector de ordenamiento */}
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm text-slate-600 outline-none cursor-pointer">
            <option value="rating">Mayor rating</option>
            <option value="reviews">Más reseñas</option>
            <option value="price">Menor precio</option>
          </select>
        </div>

        {/* Botones rápidos de categorías populares */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-xs text-slate-500 font-medium">Populares:</span>
          {CATEGORIES.slice(0, 5).map(c => (
            <button key={c.label} onClick={() => setCategoria(categoria === c.label ? '' : c.label)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${categoria === c.label ? 'text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'}`}
              style={categoria === c.label ? { background: '#2563EB' } : {}}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* GRILLA DE TARJETAS DE PROFESIONALES                                */}
        {/* ------------------------------------------------------------------ */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <p className="text-slate-500 text-sm">No se encontraron profesionales con los filtros seleccionados.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(s => (
              <div key={s.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group">
                
                {/* Imagen del servicio e insignias */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img src={s.image} alt={s.trade} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {s.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                      style={{ background: s.badge === 'Top' ? '#F97316' : '#2563EB' }}>
                      {s.badge === 'Top' ? '⭐ Top' : '✓ Pro'}
                    </span>
                  )}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm text-slate-800">
                    {s.price}
                  </div>
                </div>

                {/* Información del profesional */}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">{s.name}</p>
                      <p className="text-xs text-slate-500 truncate">{s.trade}</p>
                    </div>
                  </div>

                  {/* Calificación y reseñas */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <StarRating rating={s.rating} />
                    <span className="text-xs font-bold text-slate-800">{s.rating}</span>
                    <span className="text-xs text-slate-400">({s.reviews} reseñas)</span>
                  </div>

                  {/* Ubicación y estado */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {s.comuna}
                    <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Disponible
                    </span>
                  </div>

                  {/* Botón para ver el detalle dirigido a la página de detalle */}
                  <button onClick={() => navigate(`/detalle/${s.id}`)}
                    className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 hover:shadow-md"
                    style={{ background: '#2563EB' }}>
                    Ver detalle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botón inferior de paginación o carga extra */}
        <div className="flex justify-center mt-10">
          <button className="px-8 py-3 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all">
            Cargar más profesionales
          </button>
        </div>
      </div>
    </div>
  )
}