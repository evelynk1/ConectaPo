import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const INITIAL_LOCATIONS = [
  { id: 1, region: 'Región de Los Ríos', comuna: 'Valdivia', activeUsers: 420, villa: 'Pampa Teja' },
  { id: 2, region: 'Región de O\'Higgins', comuna: 'Rancagua', activeUsers: 310, villa: 'Manzanal' },
  { id: 3, region: 'Región Metropolitana', comuna: 'Santiago Centro', activeUsers: 1250, villa: 'Barrio Yungay' },
  { id: 4, region: 'Región de Valparaíso', comuna: 'Viña del Mar', activeUsers: 280, villa: 'Reñaca' },
  { id: 5, region: 'Región del Biobío', comuna: 'Concepción', activeUsers: 195, villa: 'Lomas de San Andrés' },
]

// Opciones predefinidas para regiones y comunas
const REGIONES_CHILE = [
  'Región de Los Ríos',
  'Región de O\'Higgins',
  'Región Metropolitana',
  'Región de Valparaíso',
  'Región del Biobío',
  'Región de La Araucanía'
]

const COMUNAS_POR_REGION = {
  'Región de Los Ríos': ['Valdivia', 'La Unión', 'Río Bueno', 'Panguipulli', 'Lanco'],
  'Región de O\'Higgins': ['Rancagua', 'Machalí', 'Rengo', 'San Fernando', 'Santa Cruz'],
  'Región Metropolitana': ['Santiago Centro', 'Providencia', 'Las Condes', 'Maipú', 'Ñuñoa', 'La Florida'],
  'Región de Valparaíso': ['Valparaíso', 'Viña del Mar', 'Concón', 'Quilpué', 'Villa Alemana'],
  'Región del Biobío': ['Concepción', 'Talcahuano', 'San Pedro de la Paz', 'Chiguayante', 'Los Ángeles'],
  'Región de La Araucanía': ['Temuco', 'Padre Las Casas', 'Villarrica', 'Pucón']
}

export default function GestionUbicaciones() {
  const navigate = useNavigate() 
  const [locations, setLocations] = useState(INITIAL_LOCATIONS)
  const [searchTerm, setSearchTerm] = useState('')
  const [newRegion, setNewRegion] = useState('')
  const [newComuna, setNewComuna] = useState('')
  const [newVilla, setNewVilla] = useState('')

  // Al cambiar de región, reseteamos la comuna seleccionada para mantener consistencia
  const handleRegionChange = (e) => {
    setNewRegion(e.target.value)
    setNewComuna('')
  }

  const handleAddLocation = (e) => {
    e.preventDefault()
    if (!newRegion.trim() || !newComuna.trim()) return

    const newEntry = {
      id: Date.now(),
      region: newRegion.trim(),
      comuna: newComuna.trim(),
      activeUsers: 0,
      villa: newVilla.trim() || 'Sector General',
    }

    setLocations([newEntry, ...locations])
    setNewRegion('')
    setNewComuna('')
    setNewVilla('')
  }

  const handleDelete = (id) => {
    setLocations(locations.filter(l => l.id !== id))
  }

  const filteredLocations = locations.filter(l => 
    l.comuna.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.villa.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Obtenemos las comunas de la región seleccionada (o un arreglo vacío si no hay región elegida)
  const comunasDisponibles = newRegion ? COMUNAS_POR_REGION[newRegion] || [] : []

  return (
    <div className="p-6 space-y-6 bg-slate-100 min-h-full">
      {/* Cabecera y migas de pan */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button onClick={() => navigate('/admin')} className="hover:text-blue-600 transition-colors cursor-pointer">Dashboard</button>
            <span>/</span>
            <span className="text-slate-800 font-medium">Gestión de Ubicaciones</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-950" style={{ fontFamily: 'Plus Jakarta Sans' }}>Zonas y Ubicaciones</h1>
          <p className="text-sm text-slate-600 mt-0.5">Controla las regiones y comunas habilitadas para la prestación de servicios.</p>
        </div>
        
        {/* Botón de volver funcionando correctamente */}
        <button
          onClick={() => navigate('/admin')}
          className="self-start sm:self-auto px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
        >
          ← Volver al Dashboard
        </button>
      </div>

      {/* Sección principal: Formulario y Tabla */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Formulario para agregar ubicación */}
        <article className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-fit">
          <h2 className="font-bold text-slate-950 text-lg mb-4">Agregar nueva ubicación</h2>
          <form onSubmit={handleAddLocation} className="space-y-4">
            
            {/* Menú desplegable para Región */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Región *</label>
              <select
                value={newRegion}
                onChange={handleRegionChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
              >
                <option value="">Selecciona una región...</option>
                {REGIONES_CHILE.map((reg) => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
            </div>

            {/* Menú desplegable para Comuna / Ciudad */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Comuna / Ciudad *</label>
              <select
                value={newComuna}
                onChange={(e) => setNewComuna(e.target.value)}
                disabled={!newRegion}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                <option value="">{newRegion ? 'Selecciona una comuna...' : 'Primero selecciona una región'}</option>
                {comunasDisponibles.map((com) => (
                  <option key={com} value={com}>{com}</option>
                ))}
              </select>
            </div>

            {/* Input normal para Villa / Población */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Villa / Población (Opcional)</label>
              <input
                type="text"
                value={newVilla}
                onChange={(e) => setNewVilla(e.target.value)}
                placeholder="Ej. Pampa Teja"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-95 shadow-sm cursor-pointer"
              style={{ background: '#10B981' }}
            >
              Registrar ubicación
            </button>
          </form>
        </article>

        {/* Tabla / Listado de ubicaciones existentes */}
        <article className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-bold text-slate-950 text-lg">Ubicaciones habilitadas</h2>
              <p className="text-xs text-slate-400 mt-0.5">Total de {locations.length} zonas configuradas</p>
            </div>
            <div className="w-full sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar región, comuna o villa..."
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Comuna / Ciudad</th>
                  <th className="px-6 py-4 text-left font-semibold">Región</th>
                  <th className="px-6 py-4 text-left font-semibold">Villa / Población</th>
                  <th className="px-6 py-4 text-left font-semibold">Usuarios en zona</th>
                  <th className="px-6 py-4 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLocations.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400 text-sm">
                      No se encontraron ubicaciones que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  filteredLocations.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 font-bold text-slate-800">
                          <span>📍</span> {l.comuna}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{l.region}</td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{l.villa}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          {l.activeUsers} usuarios
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(l.id)}
                          className="text-slate-400 hover:text-red-600 font-semibold text-xs px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>

      </div>
    </div>
  )
}