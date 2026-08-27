import { useState } from 'react'
import { useNavigate } from 'react-router-dom' // 1. Importamos el hook de navegación
import { CATEGORIES, SERVICES } from '../../data/services' 
import ServiceCard from '../../components/ServiceCard'

export default function Home() {
  const [search, setSearch] = useState('')
  const [comuna, setComuna] = useState('')
  const navigate = useNavigate() // 2. Inicializamos el hook

  // Función al enviar el formulario de búsqueda del Hero
  const handleSearch = (e) => {
    e.preventDefault()
    navigate('/buscar')
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563EB 60%, #3b82f6 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 bg-white/20 text-white backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              +2.400 profesionales activos en Chile
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
              style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Encuentra el<br />
              <span style={{ color: '#FED7AA' }}>profesional ideal</span><br />
              para tu hogar
            </h1>
            <p className="text-blue-100 text-lg mb-10 leading-relaxed">
              Conecta con gasfiteros, electricistas, carpinteros y más oficios en tu comuna. Rápido, seguro y confiable.
            </p>

            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-3 flex-1 px-4 py-2 rounded-xl bg-slate-50">
                <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="¿Qué servicio necesitas?"
                  className="flex-1 bg-transparent text-slate-900 placeholder-slate-400 text-sm outline-none" />
              </div>
              <div className="flex items-center gap-3 sm:w-44 px-4 py-2 rounded-xl bg-slate-50">
                <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <select value={comuna} onChange={e => setComuna(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-slate-600 outline-none cursor-pointer">
                  <option value="">Toda Chile</option>
                  {['Santiago', 'Providencia', 'Las Condes', 'Maipú', 'Ñuñoa', 'Vitacura', 'La Florida'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* CORREGIDO: Usamos type="submit" para que active handleSearch y nos lleve a /buscar */}
              <button type="submit"
                className="px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg shrink-0"
                style={{ background: '#F97316' }}>
                Buscar
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[['2.400+', 'Profesionales'], ['15.000+', 'Trabajos realizados'], ['98%', 'Clientes satisfechos'], ['50+', 'Comunas cubiertas']].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="text-2xl font-extrabold text-blue-600" style={{ fontFamily: 'Plus Jakarta Sans' }}>{n}</div>
              <div className="text-xs text-slate-500 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categorias */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Categorías</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>¿Qué necesitas hoy?</h2>
          </div>
          <button onClick={() => navigate('/galeria')} className="text-sm font-semibold text-blue-600 hover:text-blue-700 hidden sm:block">
            Ver todo →
          </button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {CATEGORIES.map(({ icon, label }) => (
            <button key={label} onClick={() => navigate('/buscar')}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group">
              <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
              <span className="text-xs font-medium text-slate-600 text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured services */}
      <section className="bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-1">Destacados</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Servicios recomendados</h2>
            </div>
            <button onClick={() => navigate('/galeria')} className="text-sm font-semibold text-blue-600 hover:text-blue-700 hidden sm:block">
              Ver galería →
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.slice(0, 3).map(s => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>
      </section>

      {/* banner */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="rounded-3xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #F97316, #fb923c)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <div className="relative px-8 md:px-16 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-2" style={{ fontFamily: 'Plus Jakarta Sans' }}>¿Eres un profesional?</h2>
              <p className="text-orange-100 text-sm md:text-base">Publica tus servicios y conecta con miles de clientes en Chile.</p>
            </div>
            <button onClick={() => navigate('/registro')}
              className="px-8 py-3.5 bg-white rounded-xl font-bold text-orange-500 hover:shadow-xl transition-all hover:scale-105 shrink-0 text-sm">
              Comenzar ahora
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}