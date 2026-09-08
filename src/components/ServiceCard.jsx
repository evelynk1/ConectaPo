import { useNavigate } from 'react-router-dom'
import StarRating from './StarRating'

export default function ServiceCard({ service: s }) {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group flex flex-col h-full">
      
      {/* 1. IMAGEN Y PRECIO */}
      <div className="relative h-48 overflow-hidden bg-slate-100 shrink-0">
        <img 
          src={s.image} 
          alt={s.titulo || s.trade} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm">
          {s.price}
        </div>
      </div>

      {/* 2. CONTENIDO DE LA TARJETA */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Título del Servicio (¡Lo nuevo y más importante!) */}
        <h3 className="font-bold text-slate-900 text-base mb-3 line-clamp-2" title={s.titulo}>
          {s.titulo || 'Servicio Profesional'}
        </h3>

        {/* Profesional y Categoría (Oficio) */}
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={s.avatar} 
            alt={s.name} 
            className="w-10 h-10 rounded-full object-cover border-2 border-slate-50 shadow-sm shrink-0" 
          />
          <div className="min-w-0"> {/* min-w-0 ayuda a que el truncate funcione si el nombre es muy largo */}
            {/* <p className="font-semibold text-slate-800 text-sm truncate">{s.name}</p> */}
            {/* <p className="text-xs text-orange-600 font-medium truncate">{s.trade}</p> */}
            <p className="font-semibold text-slate-800 text-sm truncate">{s.titulo}</p>
            <p className="text-xs text-orange-600 font-medium truncate">{s.name}</p>
            <p className="text-xs text-orange-600 font-medium truncate">{s.trade}</p>
          </div>
        </div>

        {/* Separador flexible para empujar el rating y el botón hacia abajo si el título es corto */}
        <div className="mt-auto">
          {/* Rating y Comuna */}
          <div className="flex items-center justify-between mb-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <StarRating rating={s.rating} />
              <span className="text-xs font-bold text-slate-700">{s.rating}</span>
              <span className="text-[11px] text-slate-400">({s.reviews})</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
              📍 {s.comuna}
            </div>
          </div>

          {/* Botón */}
          <button
            onClick={() => navigate(`/detalle/${s.id}`)}
            className="w-full py-2.5 rounded-xl text-white bg-blue-600 text-sm font-semibold transition-all hover:bg-blue-700 hover:shadow-md cursor-pointer"
          >
            Ver detalle
          </button>
        </div>
      </div>
    </div>
  )
}