import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-6">
        
        {/* Ícono animado  */}
        <div className="relative w-24 h-24 mx-auto bg-orange-50 rounded-3xl flex items-center justify-center text-4xl shadow-inner animate-bounce">
          🚧
        </div>

        {/* Código de Error y Título */}
        <div className="space-y-2">
          <span className="font-mono text-xs font-extrabold tracking-widest uppercase text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            Error 404
          </span>
          <h1 className="text-2xl font-extrabold text-slate-950" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            ¡Vaya! Página no encontrada
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Parece que te has desviado del camino. La ruta que buscas no existe o ha sido movida a otro lugar.
          </p>
        </div>

        {/* Botón de Retorno */}
        <div className="pt-2">
          <Link
            to="/"
            className="w-full inline-block py-3 px-6 rounded-2xl text-white font-semibold text-sm shadow-sm transition-all hover:opacity-95 hover:shadow-md"
            style={{ background: '#2563EB' }}
          >
            ← Volver al inicio
          </Link>
        </div>

      </div>
    </div>
  )
}