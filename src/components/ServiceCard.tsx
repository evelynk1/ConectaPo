import { useNavigate } from 'react-router-dom'
import StarRating from './StarRating'

export default function ServiceCard({ service: s }: { service: any }) {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group">

      {/* Imagen del servicio */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={s.image}
          alt={s.trade}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge */}
        {s.badge && (
          <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white"
            style={{
              background: s.badge === 'Top'
                ? '#F97316'
                : '#2563EB'
            }}
          >
            {s.badge === 'Top' ? '⭐ Top' : '✓ Pro'}
          </span>
        )}

        {/* Precio */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm text-slate-800">
          {s.price}
        </div>
      </div>

      {/* Información */}
      <div className="p-5">

        {/* Profesional */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={s.avatar}
            alt={s.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
          />

          <div>
            <p className="font-semibold text-slate-900 text-sm">
              {s.name}
            </p>

            <p className="text-xs text-slate-500">
              {s.trade}
            </p>
          </div>
        </div>

        {/* Calificación y ubicación */}
        <div className="flex items-center justify-between mb-3">

          <div className="flex items-center gap-1.5">
            <StarRating rating={s.rating} />

            <span className="text-xs font-semibold text-slate-700">
              {s.rating}
            </span>

            <span className="text-xs text-slate-400">
              ({s.reviews})
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500">
            {s.comuna}
          </div>

        </div>

        {/* Botón */}
        <button
          onClick={() => navigate(`/servicio/${s.id}`)}
          className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 hover:shadow-md"
          style={{ background: '#2563EB' }}
        >
          Ver detalle
        </button>

      </div>
    </div>
  )
}