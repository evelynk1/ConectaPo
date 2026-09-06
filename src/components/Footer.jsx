import { Link } from 'react-router-dom'
import ConectaPoLogo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">

        <Link to="/" className="cursor-pointer" aria-label="Ir al inicio">
          <ConectaPoLogo height={32} inverted />
        </Link>

        <p className="text-xs">
          © 2026 ConectaPo — Marketplace de oficios en Chile
        </p>

        <div className="flex gap-4 text-xs">
          {/* Apuntamos los tres a una ruta que mostrará el error/404 */}
          <Link to="/404" className="hover:text-white transition-colors">Términos</Link>
          <Link to="/404" className="hover:text-white transition-colors">Privacidad</Link>
          <Link to="/404" className="hover:text-white transition-colors">Contacto</Link>
        </div>
      </div>
    </footer>
  )
}