import { useState } from 'react'
import { Link } from 'react-router-dom'
import ConectaPoLogo from './Logo'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center cursor-pointer"
        >
          <ConectaPoLogo height={38} />
        </Link>

        {/* Menú desktop */}
        <div className="hidden md:flex items-center gap-6">

          <Link
            to="/buscar"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            Servicios
          </Link>

          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            Iniciar sesión
          </Link>

          <Link
            to="/registro"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md"
            style={{ background: '#F97316' }}
          >
            Registrarse
          </Link>

        </div>

        {/* Botón menú móvil */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Abrir menú"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3 flex flex-col gap-2">

          <Link
            to="/buscar"
            onClick={closeMenu}
            className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Servicios
          </Link>

          <Link
            to="/login"
            onClick={closeMenu}
            className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Iniciar sesión
          </Link>

          <Link
            to="/registro"
            onClick={closeMenu}
            className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: '#F97316' }}
          >
            Registrarse
          </Link>

        </div>
      )}
    </nav>
  )
}