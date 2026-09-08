import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ServiceCard from '../../components/ServiceCard'
import {
  getPublications,
  normalizePublication,
  getTrades,
} from '../../services/api'

export default function Home() {
  const [search, setSearch] = useState('')
  const [comuna, setComuna] = useState('')
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    getPublications()
      .then((publications) => {
        setServices(
          publications.map(normalizePublication)
        )
      })
      .catch(() => {
        setServices([])
      })
  }, [])

  useEffect(() => {
    getTrades()
      .then((trades) => {
        const normalizedTrades = trades
          .map((oficio) => ({
            id: oficio.id,
            label: oficio.nombre,
            icon: oficio.icono_url || '🛠️',
          }))
          .filter((oficio) => oficio.label)

        setCategories(normalizedTrades)
      })
      .catch(() => {
        setCategories([])
      })
      .finally(() => {
        setLoadingCategories(false)
      })
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()

    const params = new URLSearchParams()

    if (search.trim()) {
      params.set('q', search.trim())
    }

    if (comuna) {
      params.set('comuna', comuna)
    }

    const queryString = params.toString()

    navigate(
      queryString
        ? `/galeria?${queryString}`
        : '/galeria'
    )
  }

  const handleCategoryClick = (label) => {
    navigate(
      `/galeria?categoria=${encodeURIComponent(label)}`
    )
  }

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Encuentra profesionales
            <br />
            de confianza
          </h1>

          <p>
            Conecta con profesionales para tus proyectos
            y necesidades del hogar.
          </p>

          <form onSubmit={handleSearch}>
            <div className="search-box">
              <input
                type="text"
                placeholder="¿Qué servicio necesitas?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={comuna}
                onChange={(e) => setComuna(e.target.value)}
              >
                <option value="">
                  Todas las comunas
                </option>

                <option value="Santiago">
                  Santiago
                </option>

                <option value="Providencia">
                  Providencia
                </option>

                <option value="Las Condes">
                  Las Condes
                </option>

                <option value="Maipú">
                  Maipú
                </option>

                <option value="Ñuñoa">
                  Ñuñoa
                </option>

                <option value="Vitacura">
                  Vitacura
                </option>

                <option value="La Florida">
                  La Florida
                </option>

                <option value="Valdivia">
                  Valdivia
                </option>
              </select>

              <button type="submit">
                Buscar
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="categories">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">
              SERVICIOS
            </span>

            <h2>
              ¿Qué necesitas?
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate('/galeria')}
          >
            Ver todo →
          </button>
        </div>

        {loadingCategories ? (
          <p>Cargando servicios...</p>
        ) : categories.length === 0 ? (
          <p>
            No hay oficios disponibles actualmente.
          </p>
        ) : (
          <div className="categories-grid">
            {categories.map((category) => (
              <button
                type="button"
                key={category.id}
                className="category-card"
                onClick={() =>
                  handleCategoryClick(category.label)
                }
              >
                <span className="category-icon">
                  {category.icon}
                </span>

                <span className="category-label">
                  {category.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* PROFESIONALES DESTACADOS */}
      <section className="featured-services">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">
              PROFESIONALES
            </span>

            <h2>
              Profesionales destacados
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate('/galeria')}
          >
            Ver galería →
          </button>
        </div>

        {services.length === 0 ? (
          <p>
            No hay profesionales disponibles actualmente.
          </p>
        ) : (
          <div className="services-grid">
            {services.slice(0, 3).map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}