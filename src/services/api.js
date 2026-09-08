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
  const data = contentType.includes('application/json')
    ? await response.json()
    : null

  if (!response.ok) {
    throw new ApiError(
      data?.error ||
        data?.mensaje ||
        data?.message ||
        'No fue posible completar la solicitud.',
      response.status,
    )
  }

  return data
}

function authHeaders(token) {
<<<<<<< HEAD
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function normalizeUser(user = {}) {
  const role = String(user.rol || user.role || '').toUpperCase()
  const name = user.nombres || user.nombre || user.name || [user.usuario_nombre, user.usuario_apellido].filter(Boolean).join(' ')

  return {
    ...user,
    name: name || user.email || 'Usuario',
    rol: ['ADMIN', 'CLIENTE'].includes(role) ? role : 'CLIENTE',
    rolOriginal: role,
  }
=======
  return token
    ? { Authorization: `Bearer ${token}` }
    : {}
>>>>>>> 9fb780d1fb8953dfe1c0910ad1a95c937e32582a
}

/// ==========================================
// AUTH Y REGISTRO
// ==========================================

<<<<<<< HEAD
// 1. PRIMERO DEFINIMOS NORMALIZEUSER AQUÍ:
export function normalizeUser(user = {}) {
  const role = String(user.rol || user.role || '').toUpperCase()
  const name = user.nombres || user.nombre || user.name || [user.usuario_nombre, user.usuario_apellido].filter(Boolean).join(' ')

  return {
    ...user,
    name: name || user.email || 'Usuario',
    rol: ['ADMIN', 'CLIENTE'].includes(role) ? role : 'CLIENTE',
    rolOriginal: role,
  }
}

// 2. Y LUEGO EL LOGIN YA PUEDE USARLA SIN PROBLEMAS:
=======
>>>>>>> 9fb780d1fb8953dfe1c0910ad1a95c937e32582a
export async function loginUser(credentials) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  const token = data.token || data.accessToken

  if (!token) {
    throw new ApiError(
      'El servidor no devolvió un token de sesión.',
      500,
    )
  }

  return {
    token,
    user: normalizeUser(data.usuario || data.user),
  }
}

export function registerUser(user) {
  return request('/api/auth/registro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
}

// ==========================================
// OFICIOS Y PÚBLICAS
// ==========================================

export async function getTrades() {
  const data = await request('/api/oficios')

  return Array.isArray(data)
    ? data
    : (data.oficios || [])
}

export function createTrade(trade, token) {
  return request('/api/oficios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: JSON.stringify(trade),
  })
}

export function updateTrade(id, trade, token) {
  return request(`/api/oficios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: JSON.stringify(trade),
  })
}

export function deleteTrade(id, token) {
  return request(`/api/oficios/${id}`, {
    method: 'DELETE',
    headers: {
      ...authHeaders(token),
    },
  })
}

export function getRegions() {
  return request('/api/ubicaciones/regiones')
}

export function getCities() {
  return request('/api/ubicaciones/ciudades')
}

export function getCommunes() {
  return request('/api/ubicaciones/comunas')
}

export function createCommune(commune, token) {
  return request('/api/ubicaciones/comunas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify(commune),
  })
}

export function deleteCommune(id, token) {
  return request(`/api/ubicaciones/comunas/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders(token) },
  })
}

export async function getPublications() {
  const data = await request('/api/publicaciones')

  return Array.isArray(data)
    ? data
    : (data.publicaciones || [])
}

export async function getPublication(id) {
  const data = await request(`/api/publicaciones/${id}`)

  return data.publicacion || data
}

// ==========================================
// NORMALIZAR PUBLICACIÓN
// ==========================================

export function normalizePublication(publication = {}) {
  const name =
    [
      publication.usuario_nombre,
      publication.usuario_apellido,
    ]
      .filter(Boolean)
      .join(' ') ||
    'Profesional ConectaPo'

  const price = Number(
    publication.precio_base || 0
  )

  return {
    ...publication,

    name,

    trade:
      publication.oficio_nombre ||
      'Servicio profesional',

    comuna:
      publication.comuna_nombre ||
      'Chile',

    rating:
      Number(publication.evaluacion_promedio || 0),

    reviews:
      Number(publication.total_evaluaciones || 0),

    priceValue: price,

    price: price
      ? `$${price.toLocaleString('es-CL')}`
      : 'A convenir',

    // La imagen ahora viene solamente de la BD.
    // No se agrega una imagen externa por defecto.
    image:
      publication.foto_url_1 ||
      null,

    // El avatar también viene solamente de la BD.
    avatar:
      publication.avatar_url ||
      publication.usuario_avatar ||
      null,
  }
}

// ==========================================
// FUNCIONES DEL PERFIL DE USUARIO
// ==========================================

export async function getUserProfile(token) {
  const data = await request('/api/auth/perfil', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
  })

  return data.usuario_conectado
}

export async function updateUserProfile(profileData, token) {
  const data = await request('/api/auth/perfil', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: JSON.stringify(profileData),
  })

  return data.usuario
}

export async function uploadUserAvatar(file, token) {
  const formData = new FormData()

  formData.append('avatar', file)

  const response = await fetch(
    `${API_URL}/api/usuarios/avatar`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  )

  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => ({}))

    throw new ApiError(
      data.error ||
        'Error al subir la imagen al servidor.',
      response.status,
    )
  }

  return response.json()
}

// ==========================================
// FUNCIONES DE SERVICIOS / PUBLICACIONES
// ==========================================

export async function obtenerOficios() {
  const response = await fetch(
    `${API_URL}/api/oficios`,
  )

  if (!response.ok) {
    throw new Error(
      'Error al obtener los oficios.',
    )
  }

  return response.json()
}

export async function obtenerMisPublicaciones(token) {
  const response = await fetch(
    `${API_URL}/api/publicaciones/mis-publicaciones`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error(
      'Error al obtener tus publicaciones.',
    )
  }

  return response.json()
}

export async function crearPublicacionServicio(
  data,
  token,
) {
  const response = await fetch(
    `${API_URL}/api/publicaciones`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  )

  if (!response.ok) {
    const err = await response
      .json()
      .catch(() => ({}))

    throw new Error(
      err.error ||
        'Error al crear la publicación.',
    )
  }

  return response.json()
}

export async function actualizarPublicacionServicio(
  id,
  data,
  token,
) {
  const response = await fetch(
    `${API_URL}/api/publicaciones/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  )

  if (!response.ok) {
    const err = await response
      .json()
      .catch(() => ({}))

    throw new Error(
      err.error ||
        'Error al actualizar la publicación.',
    )
  }

  return response.json()
}

export async function eliminarPublicacionServicio(
  id,
  token,
) {
  const response = await fetch(
    `${API_URL}/api/publicaciones/${id}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    const err = await response
      .json()
      .catch(() => ({}))

    throw new Error(
      err.error ||
        'Error al eliminar la publicación.',
    )
  }

  return response.json()
}

// 👉 NUEVA FUNCIÓN: Subir archivos físicos de fotos

export async function subirFotosServicio(
  publicacionId,
  files,
  token,
) {
  const formData = new FormData()

  if (files[1]) {
    formData.append('foto1', files[1])
  }

  if (files[2]) {
    formData.append('foto2', files[2])
  }

  if (files[3]) {
    formData.append('foto3', files[3])
  }

  // Si no hay archivos, salimos sin hacer nada
  if (!files[1] && !files[2] && !files[3]) {
    return
  }

  const response = await fetch(
    `${API_URL}/api/publicaciones/${publicacionId}/fotos`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  )

  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => ({}))

    throw new Error(
      data.error ||
        'Error al subir las fotos.',
    )
  }

  return response.json()
}

// ==========================================
// FUNCIONES DE CALENDARIO / HORARIOS
// ==========================================

export async function guardarHorariosMasivos(
  publicacionId,
  bloques,
  token,
) {
  // Coincide con:
  // router.post('/publicacion/:publicacion_id/masivo')

  const response = await fetch(
    `${API_URL}/api/horarios/publicacion/${publicacionId}/masivo`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bloques }),
    },
  )

  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => ({}))

    throw new Error(
      data.error ||
        'Error al guardar los horarios.',
    )
  }

  return response.json()
}

<<<<<<< HEAD
export async function obtenerBloquesHorarios(publicacionId, token) {
  // Coincide con: router.get('/publicacion/:publicacion_id')
  const response = await fetch(`${API_URL}/api/horarios/publicacion/${publicacionId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Error al obtener los bloques horarios.');
  return response.json();
}

export async function eliminarBloqueHorario(bloqueId, token) {
  // Coincide con: router.delete('/bloque/:id') --> ¡Aquí estaba el error de la ruta!
  const response = await fetch(`${API_URL}/api/horarios/bloque/${bloqueId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) throw new Error('Error al eliminar el bloque horario.');
  return response.json();
=======
export async function obtenerBloquesHorarios(
  publicacionId,
  token,
) {
  // Coincide con:
  // router.get('/publicacion/:publicacion_id')

  const response = await fetch(
    `${API_URL}/api/horarios/publicacion/${publicacionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error(
      'Error al obtener los bloques horarios.',
    )
  }

  return response.json()
}

export async function eliminarBloqueHorario(
  bloqueId,
  token,
) {
  // Coincide con:
  // router.delete('/bloque/:id')

  const response = await fetch(
    `${API_URL}/api/horarios/bloque/${bloqueId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error(
      'Error al eliminar el bloque horario.',
    )
  }

  return response.json()
>>>>>>> 9fb780d1fb8953dfe1c0910ad1a95c937e32582a
}

// ==========================================
// TICKETS (ADMIN)
// ==========================================

export function createTicket(ticket, token) {
  return request('/api/tickets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: JSON.stringify(ticket),
  })
}

export async function getTickets(token) {
  const data = await request('/api/tickets', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
  })

  return Array.isArray(data)
    ? data
    : (data.tickets || [])
}

// ==========================================
// RECUPERACIÓN DE CONTRASEÑA
// ==========================================

export async function solicitarRecuperacionPass(
  telefono,
) {
  // Asegúrate de que esta ruta coincida con tu
  // auth.routes.js

  const response = await fetch(
    `${API_URL}/api/auth/solicitar-recuperacion`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ telefono }),
    },
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.error ||
        'Error al solicitar la recuperación.',
    )
  }

  return data
}

export async function resetearPassword(
  token,
  nueva_password,
) {
  // Asegúrate de que esta ruta coincida con tu
  // auth.routes.js

  const response = await fetch(
    `${API_URL}/api/auth/resetear-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        nueva_password,
      }),
    },
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.error ||
        'Error al cambiar la contraseña.',
    )
  }

  return data
}