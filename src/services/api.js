const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options)
  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    throw new ApiError(
      data?.mensaje || data?.message || 'No fue posible completar la solicitud.',
      response.status,
    )
  }

  return data
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function normalizeUser(user = {}) {
  const role = String(user.rol || user.role || '').toUpperCase()
  const name = user.nombre || user.name || [user.usuario_nombre, user.usuario_apellido].filter(Boolean).join(' ')

  return {
    ...user,
    name: name || user.email || 'Usuario',
    rol: ['ADMIN', 'CLIENTE', 'PROFESIONAL'].includes(role) ? role : 'CLIENTE',
    rolOriginal: role,
  }
}

export async function loginUser(credentials) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  const token = data.token || data.accessToken
  if (!token) throw new ApiError('El servidor no devolvió un token de sesión.', 500)

  return { token, user: normalizeUser(data.usuario || data.user) }
}

export function registerUser(user) {
  return request('/api/auth/registro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
}

export async function getPublications() {
  const data = await request('/api/publicaciones')
  return Array.isArray(data) ? data : (data.publicaciones || [])
}

export function normalizePublication(publication) {
  const name = [publication.usuario_nombre, publication.usuario_apellido].filter(Boolean).join(' ') || 'Profesional ConectaPo'
  const price = Number(publication.precio_base || 0)

  return {
    ...publication,
    name,
    trade: publication.oficio_nombre || 'Servicio profesional',
    comuna: publication.comuna_nombre || 'Chile',
    rating: Number(publication.evaluacion_promedio || 0),
    reviews: Number(publication.total_evaluaciones || 0),
    price: price ? `$${price.toLocaleString('es-CL')}` : 'A convenir',
    image: publication.foto_url_1 || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
    avatar: `https://ui-avatars.com/api/?background=2563eb&color=fff&name=${encodeURIComponent(name)}`,
  }
}

export function createTicket(ticket, token) {
  return request('/api/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(ticket),
  })
}

export function createScheduleBlocks(blocks, token) {
  const { publicacion_id, ...schedule } = blocks
  return request(`/api/horarios/publicacion/${publicacion_id}/masivo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(schedule),
  })
}
