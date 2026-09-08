import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import StarRating from '../../components/StarRating'
import {
  getPublications,
  getTrades,
  normalizePublication,
} from '../../services/api'

const normalizeText = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

export default function Galeria() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch] = useState('')
  const [categoria, setCategoria] = useState('')
  const [comuna, setComuna] = useState('')
  const [sort, setSort] = useState('rating')

  const [services, setServices] = useState([])
  const [trades, setTrades] = useState([])

  const [loading, setLoading] = useState(true)
  const [loadingTrades, setLoadingTrades] = useState(true)
  const [error, setError] = useState('')

  /*
   * Cargar profesionales reales desde la API
   */
  useEffect(() => {
    let cancelled = false

    const loadPublications = async () => {
      try {
        setLoading(true)
        setError('')

        const publications = await getPublications()

        if (cancelled) return

        const normalized = publications.map(normalizePublication)

        setServices(normalized)
      } catch (err) {
        if (cancelled) return

        console.error('Error cargando publicaciones:', err)
        setServices([])
        setError(
          err?.message ||
          'No fue posible cargar los profesionales.'
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadPublications()

    return () => {
      cancelled = true
    }
  }, [])

  /*
   * Cargar oficios reales administrados desde el Admin
   */
  useEffect(() => {
    let cancelled = false

    const loadTrades = async () => {
      try {
        setLoadingTrades(true)

        const data = await getTrades()

        if (cancelled) return

        const normalizedTrades = data
          .map((oficio) => ({
            id: oficio.id,
            label: oficio.nombre,
            icon: oficio.icono_url || '🛠️',
          }))
          .filter((oficio) => oficio.label)

        setTrades(normalizedTrades)
      } catch (err) {
        if (cancelled) return

        console.error('Error cargando oficios:', err)
        setTrades([])
      } finally {
        if (!cancelled) {
          setLoadingTrades(false)
        }
      }
    }

    loadTrades()

    return () => {
      cancelled = true
    }
  }, [])

  /*
   * Leer filtros desde la URL
   *
   * Ejemplo:
   * /galeria?q=gasfiter&comuna=Valdivia
   *
   * /galeria?categoria=Electricidad
   */
  // useEffect(() => {
  //   setSearch(searchParams.get('q') || '')
  //   setCategoria(searchParams.get('categoria') || '')
  //   setComuna(searchParams.get('comuna') || '')
  // }, [searchParams])

  /*
   * Scroll al inicio cuando se entra a Galería.
   */
  useEffect(() => {
    if (location.pathname === '/galeria') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }, [location.pathname])

  /*
   * Comunas disponibles según los profesionales reales.
   *
   * Así no dependemos de una lista fija.
   */
  const comunas = useMemo(() => {
    const values = services
      .map((service) => service.comuna)
      .filter(Boolean)
      .filter(
        (value) =>
          normalizeText(value) !== 'chile'
      )

    return [...new Set(values)].sort((a, b) =>
      a.localeCompare(b, 'es')
    )
  }, [services])

  /*
   * Filtrar y ordenar profesionales.
   */
  const filteredServices = useMemo(() => {
    const normalizedSearch = normalizeText(search)
    const normalizedCategoria = normalizeText(categoria)
    const normalizedComuna = normalizeText(comuna)

    const filtered = services.filter((service) => {
      const normalizedName = normalizeText(service.name)
      const normalizedTrade = normalizeText(service.trade)
      const normalizedServiceComuna = normalizeText(
        service.comuna
      )

      /*
       * Búsqueda por:
       * - nombre
       * - oficio
       */
      const matchesSearch =
        normalizedSearch === '' ||
        normalizedName.includes(normalizedSearch) ||
        normalizedTrade.includes(normalizedSearch)

      /*
       * Filtro de oficio/categoría.
       */
      const matchesCategoria =
        normalizedCategoria === '' ||
        normalizedTrade === normalizedCategoria ||
        normalizedTrade.includes(normalizedCategoria) ||
        normalizedCategoria.includes(normalizedTrade)

      /*
       * Filtro de comuna.
       */
      const matchesComuna =
        normalizedComuna === '' ||
        normalizedServiceComuna === normalizedComuna

      return (
        matchesSearch &&
        matchesCategoria &&
        matchesComuna
      )
    })

    /*
     * Ordenamiento.
     */
    return filtered.sort((a, b) => {
      if (sort === 'rating') {
        return (
          Number(b.rating || 0) -
          Number(a.rating || 0)
        )
      }

      if (sort === 'reviews') {
        return (
          Number(b.reviews || 0) -
          Number(a.reviews || 0)
        )
      }

      if (sort === 'price') {
        return (
          Number(a.priceValue || 0) -
          Number(b.priceValue || 0)
        )
      }

      return 0
    })
  }, [
    services,
    search,
    categoria,
    comuna,
    sort,
  ])

  /*
   * Actualizar parámetros de la URL.
   */
  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    setSearchParams(params)
  }

  /*
   * Búsqueda.
   *
   * El filtro se mantiene también en la URL.
   */
  const handleSearch = (event) => {
    event.preventDefault()

    const params = new URLSearchParams(searchParams)

    if (search.trim()) {
      params.set('q', search.trim())
    } else {
      params.delete('q')
    }

    if (comuna) {
      params.set('comuna', comuna)
    } else {
      params.delete('comuna')
    }

    navigate(
      params.toString()
        ? `/galeria?${params.toString()}`
        : '/galeria'
    )
  }

  /*
   * Seleccionar categoría.
   */
  const handleCategory = (label) => {
    const nextCategory =
      categoria === label ? '' : label

    setCategoria(nextCategory)

    updateFilter(
      'categoria',
      nextCategory
    )
  }

  /*
   * Limpiar todos los filtros.
   */
  const clearFilters = () => {
    setSearch('')
    setCategoria('')
    setComuna('')

    setSearchParams({})
  }

  return (
    <div
      id="galeria"
      className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8"
    >
      <div className="max-w-6xl mx-auto px-4">

        {/* ENCABEZADO */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">
            Directorio
          </p>

          <h1
            className="text-2xl font-bold text-slate-900"
            style={{
              fontFamily: 'Plus Jakarta Sans',
            }}
          >
            Galería de profesionales
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            {loading
              ? 'Cargando profesionales...'
              : `${filteredServices.length} profesionales disponibles`}
          </p>
        </div>

        {/* BARRA DE BÚSQUEDA Y FILTROS */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-3">

            {/* BUSCAR */}
            <div className="flex items-center gap-2 flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <svg
                className="w-4 h-4 text-slate-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Buscar oficio o nombre..."
                className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none"
              />
            </div>

            {/* CATEGORÍAS */}
            <select
              value={categoria}
              onChange={(event) => {
                const value = event.target.value

                setCategoria(value)

                updateFilter(
                  'categoria',
                  value
                )
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm text-slate-600 outline-none cursor-pointer"
            >
              <option value="">
                Todas las categorías
              </option>

              {loadingTrades ? (
                <option disabled>
                  Cargando oficios...
                </option>
              ) : (
                trades.map((trade) => (
                  <option
                    key={trade.id}
                    value={trade.label}
                  >
                    {trade.icon} {trade.label}
                  </option>
                ))
              )}
            </select>

            {/* COMUNAS */}
            <select
              value={comuna}
              onChange={(event) => {
                const value = event.target.value

                setComuna(value)

                updateFilter(
                  'comuna',
                  value
                )
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm text-slate-600 outline-none cursor-pointer"
            >
              <option value="">
                Todas las comunas
              </option>

              {comunas.map((value) => (
                <option
                  key={value}
                  value={value}
                >
                  {value}
                </option>
              ))}
            </select>

            {/* ORDEN */}
            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
              className="px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm text-slate-600 outline-none cursor-pointer"
            >
              <option value="rating">
                Mayor rating
              </option>

              <option value="reviews">
                Más reseñas
              </option>

              <option value="price">
                Menor precio
              </option>
            </select>

            {/* BOTÓN BUSCAR */}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 hover:shadow-md"
              style={{
                background: '#2563EB',
              }}
            >
              Buscar
            </button>
          </div>
        </form>

        {/* CATEGORÍAS POPULARES */}
        {!loadingTrades &&
          trades.length > 0 && (
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span className="text-xs text-slate-500 font-medium">
                Populares:
              </span>

              {trades.slice(0, 8).map((trade) => {
                const active =
                  categoria === trade.label

                return (
                  <button
                    key={trade.id}
                    type="button"
                    onClick={() =>
                      handleCategory(
                        trade.label
                      )
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${active
                        ? 'text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'
                      }`}
                    style={
                      active
                        ? {
                          background:
                            '#2563EB',
                        }
                        : {}
                    }
                  >
                    {trade.icon}{' '}
                    {trade.label}
                  </button>
                )
              })}
            </div>
          )}

        {/* FILTROS ACTIVOS */}
        {(search || categoria || comuna) && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-xs text-slate-500">
              Filtros activos:
            </span>

            {search && (
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                Búsqueda: {search}
              </span>
            )}

            {categoria && (
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                Oficio: {categoria}
              </span>
            )}

            {comuna && (
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                Comuna: {comuna}
              </span>
            )}

            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-slate-500 hover:text-blue-600"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* CARGANDO */}
        {loading && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <p className="text-slate-500 text-sm">
              Cargando profesionales...
            </p>
          </div>
        )}

        {/* SIN RESULTADOS */}
        {!loading &&
          !error &&
          filteredServices.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <div className="text-4xl mb-3">
                🔍
              </div>

              <p className="text-slate-700 font-semibold mb-1">
                No encontramos profesionales
              </p>

              <p className="text-slate-500 text-sm mb-4">
                Prueba cambiando los filtros o la búsqueda.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
                style={{
                  background: '#2563EB',
                }}
              >
                Limpiar filtros
              </button>
            </div>
          )}

        {/* GRILLA */}
        {!loading &&
          filteredServices.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group"
                >
                  {/* IMAGEN */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={
                          service.trade ||
                          'Profesional'
                        }
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100">
                        <span className="text-4xl">
                          🛠️
                        </span>
                      </div>
                    )}

                    {service.badge && (
                      <span
                        className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                        style={{
                          background:
                            service.badge === 'Top'
                              ? '#F97316'
                              : '#2563EB',
                        }}
                      >
                        {service.badge === 'Top'
                          ? '⭐ Top'
                          : '✓ Pro'}
                      </span>
                    )}

                    {service.price && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm text-slate-800">
                        {service.price}
                      </div>
                    )}
                  </div>

                  {/* INFORMACIÓN */}
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      {service.avatar ? (
                        <img
                          src={service.avatar}
                          alt={
                            service.name ||
                            'Profesional'
                          }
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                          👤
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">
                          {service.name ||
                            'Profesional'}
                        </p>

                        <p className="text-xs text-slate-500 truncate">
                          {service.trade ||
                            'Servicio profesional'}
                        </p>
                      </div>
                    </div>

                    {/* RATING */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <StarRating
                        rating={
                          service.rating || 0
                        }
                      />

                      <span className="text-xs font-bold text-slate-800">
                        {Number(
                          service.rating || 0
                        ).toFixed(1)}
                      </span>

                      <span className="text-xs text-slate-400">
                        ({service.reviews || 0}{' '}
                        reseñas)
                      </span>
                    </div>

                    {/* UBICACIÓN */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>

                      <span className="truncate">
                        {service.comuna ||
                          'Ubicación no disponible'}
                      </span>

                      <span className="w-1 h-1 rounded-full bg-slate-300 mx-1 shrink-0" />

                      <span className="flex items-center gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Disponible
                      </span>
                    </div>

                    {/* DETALLE */}
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/detalle/${service.id}`
                        )
                      }
                      className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 hover:shadow-md"
                      style={{
                        background: '#2563EB',
                      }}
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* BOTÓN INFERIOR */}
        {!loading &&
          filteredServices.length > 0 && (
            <div className="flex justify-center mt-10">
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  })
                }}
                className="px-8 py-3 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all"
              >
                Volver arriba ↑
              </button>
            </div>
          )}
      </div>
    </div>
  )
}