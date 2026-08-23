// Importamos Link desde React Router.
// Nos permite navegar entre las páginas de nuestra aplicación
// sin recargar completamente el navegador.
import { Link } from 'react-router-dom'

// Importamos el componente reutilizable del logo.
import ConectaPoLogo from './Logo'


// Componente Footer.
// Ya no recibe setScreen porque la navegación se realizará
// mediante React Router.
export default function Footer() {

  return (

    // Contenedor principal del footer.

    <footer className="bg-slate-900 text-slate-400 py-10">

      {/* Contenedor del contenido */}
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">


        {/* =========================
            LOGO
            ========================= */}

        {/* 
          Link hacia la página principal.

        */}
        <Link
          to="/"
          className="cursor-pointer"
          aria-label="Ir al inicio"
        >
          {/* 
            Usamos el mismo componente Logo,
            pero con inverted=true para mostrarlo
            correctamente sobre el fondo oscuro.
          */}
          <ConectaPoLogo
            height={32}
            inverted
          />
        </Link>


        {/* =========================
            COPYRIGHT
            ========================= */}

        {/* Texto de copyright */}
        <p className="text-xs">
          © 2026 ConectaPo — Marketplace de oficios en Chile
        </p>


        {/* =========================
            ENLACES
            ========================= */}

        <div className="flex gap-4 text-xs">

          {/* 
            Enlace a términos.
            
            Por ahora usamos "#", porque todavía
            no existe una ruta específica para esta página.
          */}
          <a
            href="#"
            className="hover:text-white transition-colors"
          >
            Términos
          </a>

          {/* Enlace a privacidad */}
          <a
            href="#"
            className="hover:text-white transition-colors"
          >
            Privacidad
          </a>

          {/* Enlace a contacto */}
          <a
            href="#"
            className="hover:text-white transition-colors"
          >
            Contacto
          </a>

        </div>

      </div>

    </footer>
  )
}