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
          <a href="#" className="hover:text-white transition-colors">Términos</a>
          <a href="#" className="hover:text-white transition-colors">Privacidad</a>
          <a href="#" className="hover:text-white transition-colors">Contacto</a>
        </div>
      </div>
    </footer>
  )
}