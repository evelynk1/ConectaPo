import { useNavigate } from 'react-router-dom'
import StarRating from './StarRating'

export default function ServiceCard({ service: s }) {
  const navigate = useNavigate()

  // 1. EL AVATAR: Le damos prioridad a avatar_url. Si viene vacío, usamos ui-avatars.
  const avatarSeguro = s.avatar_url || s.avatar || `https://ui-avatars.com/api/?background=2563eb&color=fff&name=${encodeURIComponent(s.name || 'User')}`;

  // 2. EL TÍTULO: Atrapamos las posibles formas en las que venga desde la base de datos.
  // (Si en tu BD se llama distinto, agrégalo aquí, ej: s.nombre_servicio)
  const tituloSeguro = s.titulo || s.titulo_publicacion || s.title || 'Servicio Profesional';

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col h-full">
      
      {/* IMAGEN DEL SERVICIO */}
      <div className="h-48 w-full shrink-0 relative bg-slate-100">
        <img 
          src={s.image} 
          alt={tituloSeguro} 
          className="w-full h-full object-cover" 
        />
        {/* ... resto de tu código ... */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm">
          {s.price}
        </div>
      </div>

      {/* ZONA DE TEXTOS (Se expande hacia abajo) */}
      <div className="p-4 flex flex-col flex-1 bg-white relative z-10">
        
        {/* Título del Servicio */}
        <h3 className="font-bold text-slate-900 text-sm mb-3 line-clamp-2 min-h-[40px]" title={tituloSeguro}>
          {tituloSeguro}
        </h3>

        {/* Profesional y Categoría (Con avatar bloqueado) */}
        <div className="flex items-center gap-3 mb-4">
          {/* Contenedor estricto para el avatar para que no desaparezca */}
          <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden bg-slate-200 border-2 border-slate-100">
            <img 
              src={avatarSeguro} 
              alt={s.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 text-xs truncate">{s.name}</p>
            <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wide truncate">{s.trade}</p>
          </div>
        </div>

        {/* Base de la tarjeta (Rating, Comuna y Botón) */}
        <div className="mt-auto pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <StarRating rating={s.rating} />
              <span className="text-xs font-bold text-slate-700 ml-1">{s.rating}</span>
              <span className="text-[10px] text-slate-400">({s.reviews})</span>
            </div>
            <div className="text-[10px] font-semibold text-slate-500 truncate max-w-[80px]">
              📍 {s.comuna}
            </div>
          </div>

          <button
            onClick={() => navigate(`/detalle/${s.id}`)}
            className="w-full py-2.5 rounded-xl text-white bg-blue-600 text-xs font-bold transition-all hover:bg-blue-700 hover:shadow-md cursor-pointer"
          >
            Ver detalle
          </button>
        </div>
      </div>
    </div>
  )
}