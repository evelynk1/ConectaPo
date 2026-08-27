import { useState } from 'react'
import { Link } from 'react-router-dom'
import ConectaPoLogo from './Logo'

export default function Navbar() {
  // Estado para controlar si el menú móvil (en pantallas pequeñas) está abierto o cerrado
  const [menuOpen, setMenuOpen] = useState(false)

  // Función auxiliar para cerrar el menú móvil cuando el usuario hace clic en una opción
  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    // Barra de navegación fija en la parte superior (sticky) con diseño limpio y sombra sutil
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* 1. LOGO PRINCIPAL: Al hacer clic, redirige al usuario a la página de inicio (Home) */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center cursor-pointer"
        >
          <ConectaPoLogo height={38} />
        </Link>

        {/* 2. MENÚ DE ESCRITORIO (Visible solo en pantallas medianas 'md' en adelante) */}
        <div className="hidden md:flex items-center gap-6">

          {/* Enlace que lleva a la galería con hash */}
          <Link
            to="/galeria#galeria"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            Servicios
          </Link>

          {/* Enlace para iniciar sesión */}
          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            Iniciar sesión
          </Link>

          {/* Botón destacado para registrarse con color corporativo */}
          <Link
            to="/registro"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md"
            style={{ background: '#F97316' }}
          >
            Registrarse
          </Link>

        </div>

        {/* 3. BOTÓN HAMBURGUESA PARA MÓVIL (Visible solo en pantallas pequeñas) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)} // Alterna entre true/false al hacer clic
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Abrir menú"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {/* Cambia el ícono de barras a una "X" si el menú está abierto */}
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

      {/* 4. MENÚ DESPLEGABLE MÓVIL (Se muestra únicamente cuando menuOpen es true) */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3 flex flex-col gap-2">

          {/* Enlace de servicios para versión móvil con hash */}
          <Link
            to="/galeria#galeria"
            onClick={closeMenu} // Cierra el menú al hacer clic
            className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Servicios
          </Link>

          {/* Enlace de inicio de sesión para versión móvil */}
          <Link
            to="/login"
            onClick={closeMenu} // Cierra el menú al hacer clic
            className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Iniciar sesión
          </Link>

          {/* Botón de registro centrado para versión móvil */}
          <Link
            to="/registro"
            onClick={closeMenu} // Cierra el menú al hacer clic
            className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-white text-center"
            style={{ background: '#F97316' }}
          >
            Registrarse
          </Link>

        </div>
      )}
    </nav>
  )
}