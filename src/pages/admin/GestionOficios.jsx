import { useState } from 'react'
import { useNavigate } from 'react-router-dom' // 👈 Importante para que funcione la navegación

const INITIAL_TRADES = [
  { id: 1, name: 'Electricista', category: 'Instalaciones y Reparaciones', activeCount: 142, icon: '⚡' },
  { id: 2, name: 'Carpintero', category: 'Construcción y Muebles', activeCount: 89, icon: '🪵' },
  { id: 3, name: 'Plomero / Gasfíter', category: 'Instalaciones y Reparaciones', activeCount: 115, icon: '🔧' },
  { id: 4, name: 'Pintor', category: 'Remodelación', activeCount: 64, icon: '🎨' },
  { id: 5, name: 'Jardinero', category: 'Mantención y Exteriores', activeCount: 53, icon: '🌱' },
]

// Lista de emojis en formato de "teclado visual"
const EMOJI_KEYBOARD = [
  '🛠️', '⚡', '🔧', '🪵', '🎨', '🌱', '🧹', '💻', 
  '🔨', '🪚', '🧰', '🧱', '💡', '🚰', '🔑', '🚪',
  '❄️', '🔥', '⚙️', '📐', '📱', '🚗', '🧼', '🪴'
]

export default function GestionOficios() {
  const navigate = useNavigate() // 👈 Activamos el hook
  const [trades, setTrades] = useState(INITIAL_TRADES)
  const [searchTerm, setSearchTerm] = useState('')
  const [newTradeName, setNewTradeName] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newIcon, setNewIcon] = useState('🛠️')

  const handleAddTrade = (e) => {
    e.preventDefault()
    if (!newTradeName.trim() || !newCategory.trim()) return

    const newEntry = {
      id: Date.now(),
      name: newTradeName.trim(),
      category: newCategory.trim(),
      activeCount: 0,
      icon: newIcon,
    }

    setTrades([newEntry, ...trades])
    setNewTradeName('')
    setNewCategory('')
    setNewIcon('🛠️')
  }

  const handleDelete = (id) => {
    setTrades(trades.filter(t => t.id !== id))
  }

  const filteredTrades = trades.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6 bg-slate-100 min-h-full">
      {/* Cabecera y migas de pan */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button onClick={() => navigate('/admin')} className="hover:text-blue-600 transition-colors cursor-pointer">Dashboard</button>
            <span>/</span>
            <span className="text-slate-800 font-medium">Gestión de Oficios</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-950" style={{ fontFamily: 'Plus Jakarta Sans' }}>Catálogo de Oficios</h1>
          <p className="text-sm text-slate-600 mt-0.5">Administra las profesiones y oficios disponibles para los usuarios en la plataforma.</p>
        </div>
        
        {/* Botón de volver funcionando correctamente */}
        <button
          onClick={() => navigate('/admin')}
          className="self-start sm:self-auto px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
        >
          ← Volver al Dashboard
        </button>
      </div>

      {/* Sección principal: Formulario de creación y Listado */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Formulario para agregar oficio */}
        <article className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-fit">
          <h2 className="font-bold text-slate-950 text-lg mb-4">Agregar nuevo oficio</h2>
          <form onSubmit={handleAddTrade} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nombre del oficio *</label>
              <input
                type="text"
                value={newTradeName}
                onChange={(e) => setNewTradeName(e.target.value)}
                placeholder="Ej. Cerámicos / TdM"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Categoría general *</label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Ej. Construcción"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Teclado visual de emojis */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">Selecciona un ícono</label>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">Seleccionado: {newIcon}</span>
              </div>
              <div className="grid grid-cols-8 gap-1.5 p-2 bg-slate-50 rounded-2xl border border-slate-200">
                {EMOJI_KEYBOARD.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setNewIcon(emoji)}
                    className={`h-9 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                      newIcon === emoji 
                        ? 'bg-blue-600 text-white shadow-sm scale-105' 
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-100'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-95 shadow-sm cursor-pointer"
              style={{ background: '#2563EB' }}
            >
              Registrar oficio
            </button>
          </form>
        </article>

        {/* Tabla / Listado de oficios existentes */}
        <article className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-bold text-slate-950 text-lg">Oficios registrados</h2>
              <p className="text-xs text-slate-400 mt-0.5">Total de {trades.length} oficios en el sistema</p>
            </div>
            <div className="w-full sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar oficio..."
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Oficio</th>
                  <th className="px-6 py-4 text-left font-semibold">Categoría</th>
                  <th className="px-6 py-4 text-left font-semibold">Profesionales activos</th>
                  <th className="px-6 py-4 text-right font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTrades.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-400 text-sm">
                      No se encontraron oficios que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  filteredTrades.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
                            {t.icon}
                          </span>
                          <span className="font-bold text-slate-800">{t.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{t.category}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {t.activeCount} registrados
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(t.id)}
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