import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import ConectaPoLogo from '../../components/Logo'

export default function MiPerfil() {
  const navigate = useNavigate()
  
  // Estado para el menú móvil del Navbar
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  // Estados para controlar los modales
  const [showNewServiceModal, setShowNewServiceModal] = useState(false)
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Estado del Modo Vacaciones
  const [isVacation, setIsVacation] = useState(false)
  // Estado para los datos del perfil del usuario (con campo de habilidades como string para el input)
  const [userProfile, setUserProfile] = useState({
    name: 'Carlos Mendoza',
    title: 'Gasfitero certificado',
    location: 'Providencia, Santiago',
    email: 'carlos.mendoza@gmail.com',
    phone: '+56 9 8765 4321',
    experience: '12 años de experiencia',
    bio: 'Gasfitero certificado con más de 12 años de experiencia en instalaciones residenciales y comerciales. Especialista en detección de fugas, instalación de cañerías y reparación de artefactos sanitarios. Trabajo con garantía y materiales de primera calidad.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&auto=format',
    skills: 'Gasfitería, Plomería, Instalaciones, Emergencias, Detección de fugas'
  })

  // Estado temporal para el formulario de edición de perfil
  const [editForm, setEditForm] = useState(userProfile)

  // Estado para los datos de inicio de sesión (si se llega a usar desde los modales)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  
  // Estado para la lista de servicios (con propiedad 'status' para pausar/eliminar)
  const [services, setServices] = useState([
    { 
      id: 1, 
      title: 'Instalación de Grifería y Sanitarios', 
      price: '$25.000', 
      cat: 'Gasfitería', 
      desc: 'Servicio profesional garantizado en zona oriente.',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
      status: 'activo'
    },
    { 
      id: 2, 
      title: 'Detección y Reparación de Fugas', 
      price: '$40.000', 
      cat: 'Urgencias', 
      desc: 'Equipo especializado para ubicar fugas ocultas.',
      image: 'https://images.unsplash.com/photo-1542013936693-893e3d6e1c2b?w=400&h=300&fit=crop',
      status: 'activo'
    }
  ])

  // Estado para el formulario de nuevo servicio
  const [newService, setNewService] = useState({ 
    title: '', 
    price: '', 
    cat: 'Gasfitería', 
    desc: '', 
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop' 
  })

  // Funciones de subida de imágenes
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setNewService({ ...newService, image: imageUrl })
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setEditForm({ ...editForm, avatar: imageUrl })
    }
  }

  const handleCreateService = (e) => {
    e.preventDefault()
    if (!newService.title || !newService.price) return

    setServices([...services, { id: Date.now(), ...newService, status: 'activo' }])
    setNewService({ title: '', price: '', cat: 'Gasfitería', desc: '', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop' })
    setShowNewServiceModal(false)
  }

  // Guardar los cambios del perfil
  const handleSaveProfile = (e) => {
    e.preventDefault()
    setUserProfile(editForm)
    setShowEditProfileModal(false)
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setShowLoginModal(false)
  }

  // Pausar o activar servicio
  const toggleServiceStatus = (id) => {
    setServices(services.map(s => {
      if (s.id === id) {
        return { ...s, status: s.status === 'activo' ? 'pausado' : 'activo' }
      }
      return s
    }))
  }

  // Eliminar servicio
  const deleteService = (id) => {
    setServices(services.filter(s => s.id !== id))
  }

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      
      {/* NAVBAR SUPERIOR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" onClick={closeMenu} className="flex items-center cursor-pointer">
            <ConectaPoLogo height={38} />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/galeria#galeria" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Servicios</Link>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm overflow-hidden">
                <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900">{userProfile.name}</p>
                <p className="text-[10px] text-slate-500">Sesión activa</p>
              </div>

              <button onClick={handleLogout} title="Cerrar sesión" className="ml-2 p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3 flex flex-col gap-2">
            <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl mb-1">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs overflow-hidden">
                <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{userProfile.name}</p>
                <p className="text-[10px] text-slate-500">Sesión activa</p>
              </div>
            </div>
            <Link to="/" onClick={closeMenu} className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Home</Link>
            <Link to="/galeria#galeria" onClick={closeMenu} className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Servicios</Link>
            <button onClick={() => { closeMenu(); handleLogout(); }} className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer">
              Cerrar sesión
            </button>
          </div>
        )}
      </nav>

      {/* BANNER SUPERIOR */}
      <div className="h-48 md:h-60 relative overflow-hidden w-full" style={{ background: 'linear-gradient(135deg, #2563EB, #F97316)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Cabecera del perfil */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 mb-8 relative z-10">
          <div className="flex items-end gap-5">
            <div className="relative">
              <img src={userProfile.avatar} alt={userProfile.name} className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-xl bg-white" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg flex items-center justify-center border-2 border-white shadow-md bg-orange-500 text-white">
                ⚡
              </div>
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>{userProfile.name}</h1>
              </div>
              <p className="text-slate-500 text-sm">{userProfile.title} · {userProfile.location}</p>
            </div>
          </div>

          <button 
            onClick={() => {
              setEditForm(userProfile)
              setShowEditProfileModal(true)
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:shadow-md transition-all self-start sm:self-auto cursor-pointer"
          >
            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar perfil
          </button>
        </div>

        {/* CONTENEDOR DE DOS COLUMNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna Izquierda */}
          <div className="lg:col-span-1 space-y-6">
            
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-3">
              <h3 className="font-semibold text-slate-900 text-sm mb-3">Herramientas de usuario</h3>
              
              <button onClick={() => navigate('/panel/calendario')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all text-sm font-semibold text-left cursor-pointer">
                <span className="text-xl">📅</span>
                <div>
                  <div>Mi Calendario</div>
                  <div className="text-xs text-blue-500 font-normal">Gestionar disponibilidad</div>
                </div>
              </button>

              <button onClick={() => navigate('/panel/tickets')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 transition-all text-sm font-semibold text-left cursor-pointer">
                <span className="text-xl">🎫</span>
                <div>
                  <div>Soporte / Tickets</div>
                  <div className="text-xs text-orange-500 font-normal">Crear nuevo ticket</div>
                </div>
              </button>

              <div className="pt-2 border-t border-slate-100 mt-2">
                <div className="flex items-center justify-between p-2">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Modo Vacaciones</p>
                    <p className="text-[11px] text-slate-500">Ocultar servicios temporalmente</p>
                  </div>
                  <button onClick={() => setIsVacation(!isVacation)} className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${isVacation ? 'bg-orange-500' : 'bg-slate-300'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isVacation ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
                {isVacation && (
                  <p className="text-[11px] text-orange-600 bg-orange-50 p-2 rounded-lg font-medium mt-1">
                    ⚠️ Tus servicios están pausados por vacaciones.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-sm mb-4">Información de contacto</h3>
              <div className="space-y-3">
                {[
                  ['📧', userProfile.email], 
                  ['📞', userProfile.phone], 
                  ['📍', userProfile.location], 
                  ['🏗️', userProfile.experience]
                ].map(([icon, val]) => (
                  <div key={val} className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="text-base">{icon}</span>
                    <span className="truncate">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-sm mb-3">Habilidades</h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.skills.split(',').map((skill, index) => (
                  <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-sm mb-3">Descripción</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {userProfile.bio}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Mis publicaciones y servicios</h3>
                  <p className="text-xs text-slate-500">Gestiona los servicios que ofreces a los clientes</p>
                </div>
                <button 
                  onClick={() => setShowNewServiceModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:opacity-95 cursor-pointer"
                  style={{ background: '#F97316' }}
                >
                  <span>+</span> Crear servicio
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                {services.map(pub => (
                  <div key={pub.id} className="rounded-2xl border border-slate-100 bg-white overflow-hidden hover:border-orange-200 hover:shadow-md transition-all flex flex-col">
                    <div className="h-36 w-full overflow-hidden relative bg-slate-100">
                      <img src={pub.image} alt={pub.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 text-[10px] font-bold text-white bg-slate-900/70 backdrop-blur-sm px-2 py-0.5 rounded-md">{pub.cat}</span>
                      <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md ${pub.status === 'activo' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                        {pub.status}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col flex-1 justify-between space-y-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{pub.title}</h4>
                          <span className="text-xs font-extrabold text-orange-600">{pub.price}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{pub.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Administrar publicaciones</h3>
                <p className="text-xs text-slate-500">Pausa temporalmente o elimina tus servicios publicados.</p>
              </div>

              <div className="space-y-3 pt-1">
                {services.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">No tienes publicaciones activas.</p>
                ) : (
                  services.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{s.title}</p>
                        <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${s.status === 'activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {s.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleServiceStatus(s.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition-all cursor-pointer">
                          {s.status === 'activo' ? 'Pausar' : 'Activar'}
                        </button>
                        <button onClick={() => deleteService(s.id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all cursor-pointer">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ================= MODALES ================= */}

      {/* 1. MODAL PARA EDITAR PERFIL */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-base" style={{ fontFamily: 'Plus Jakarta Sans' }}>Editar Información del Perfil</h3>
              <button onClick={() => setShowEditProfileModal(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all font-bold text-xs cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Foto de perfil</label>
                <div className="flex items-center gap-4">
                  <img src={editForm.avatar} alt="Avatar preview" className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre completo</label>
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Título u oficio</label>
                  <input 
                    type="text" 
                    value={editForm.title}
                    onChange={e => setEditForm({...editForm, title: e.target.value})}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Correo electrónico</label>
                  <input 
                    type="email" 
                    value={editForm.email}
                    onChange={e => setEditForm({...editForm, email: e.target.value})}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
                  <input 
                    type="text" 
                    value={editForm.phone}
                    onChange={e => setEditForm({...editForm, phone: e.target.value})}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ubicación / Comuna</label>
                  <input 
                    type="text" 
                    value={editForm.location}
                    onChange={e => setEditForm({...editForm, location: e.target.value})}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Años de experiencia</label>
                  <input 
                    type="text" 
                    value={editForm.experience}
                    onChange={e => setEditForm({...editForm, experience: e.target.value})}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Habilidades (separadas por comas)</label>
                <input 
                  type="text" 
                  value={editForm.skills}
                  onChange={e => setEditForm({...editForm, skills: e.target.value})}
                  placeholder="Ej: Gasfitería, Plomería, Calefont"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Biografía / Descripción</label>
                <textarea 
                  rows={4} 
                  value={editForm.bio}
                  onChange={e => setEditForm({...editForm, bio: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-95 shadow-md cursor-pointer" style={{ background: '#F97316' }}>
                  Guardar cambios
                </button>
                <button type="button" onClick={() => setShowEditProfileModal(false)} className="px-5 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. MODAL PARA CREAR NUEVO SERVICIO */}
      {showNewServiceModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-base" style={{ fontFamily: 'Plus Jakarta Sans' }}>Nuevo Servicio / Publicación</h3>
              <button onClick={() => setShowNewServiceModal(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all font-bold text-xs cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título del servicio</label>
                <input 
                  type="text" 
                  placeholder="Ej. Reparación de calefont"
                  value={newService.title}
                  onChange={e => setNewService({...newService, title: e.target.value})}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Precio aproximado</label>
                  <input 
                    type="text" 
                    placeholder="Ej. $30.000"
                    value={newService.price}
                    onChange={e => setNewService({...newService, price: e.target.value})}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría</label>
                  <select 
                    value={newService.cat}
                    onChange={e => setNewService({...newService, cat: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-white"
                  >
                    <option value="Gasfitería">Gasfitería</option>
                    <option value="Urgencias">Urgencias</option>
                    <option value="Instalaciones">Instalaciones</option>
                    <option value="Mantención">Mantención</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subir foto del servicio</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                />
              </div>

              {newService.image && (
                <div className="relative h-28 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={newService.image} alt="Vista previa" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 bg-slate-900/70 text-white text-[10px] px-2 py-0.5 rounded">Vista previa</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción breve</label>
                <textarea 
                  rows={3} 
                  placeholder="Detalla qué incluye tu servicio..."
                  value={newService.desc}
                  onChange={e => setNewService({...newService, desc: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-95 shadow-md cursor-pointer" style={{ background: '#F97316' }}>
                  Publicar servicio
                </button>
                <button type="button" onClick={() => setShowNewServiceModal(false)} className="px-5 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. MODAL PARA INICIAR SESIÓN */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base" style={{ fontFamily: 'Plus Jakarta Sans' }}>Iniciar Sesión</h3>
                <p className="text-xs text-slate-500 mt-0.5">Ingresa a tu cuenta para continuar</p>
              </div>
              <button onClick={() => setShowLoginModal(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all font-bold text-xs cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Correo electrónico</label>
                <input 
                  type="email" 
                  placeholder="ejemplo@correo.com"
                  value={loginData.email}
                  onChange={e => setLoginData({...loginData, email: e.target.value})}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contraseña</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={e => setLoginData({...loginData, password: e.target.value})}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-95 shadow-md cursor-pointer" style={{ background: '#F97316' }}>
                  Entrar
                </button>
                <button type="button" onClick={() => setShowLoginModal(false)} className="px-5 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}