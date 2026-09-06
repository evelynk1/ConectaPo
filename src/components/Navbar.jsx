import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConectaPoLogo from "./Logo";
import { useUser } from "../context/useUser";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useUser();

  const navigate = useNavigate();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

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
            to="/galeria"
            onClick={closeMenu}
            className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Servicios
          </Link>

          {/* Si NO hay usuario conectado */}
          {!user && (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                Iniciar sesión
              </Link>

              <Link
                to="/registro"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all bg-orange-500 hover:bg-orange-600 hover:shadow-md"
              >
                Registrarse
              </Link>
            </>
          )}

          {/* Si HAY usuario conectado */}
          {user && (
            <>
              {['CLIENTE', 'PROFESIONAL'].includes(user.rol) && (
                <Link
                  to="/panel/perfil"
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Mi perfil
                </Link>
              )}

              {user.rol === "ADMIN" && (
                <Link
                  to="/admin"
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Administración
                </Link>
              )}

              <span className="text-sm font-semibold text-slate-700">
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Cerrar sesión
              </button>
            </>
          )}
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

          {!user && (
            <>
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
                style={{ background: "#F97316" }}
              >
                Registrarse
              </Link>
            </>
          )}

          {user && (
            <>
              {['CLIENTE', 'PROFESIONAL'].includes(user.rol) && (
                <Link
                  to="/panel/perfil"
                  onClick={closeMenu}
                  className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Mi perfil
                </Link>
              )}

              {user.rol === "ADMIN" && (
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Administración
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-white bg-red-500"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
