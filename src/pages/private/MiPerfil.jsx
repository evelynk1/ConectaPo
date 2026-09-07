import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/useUser';
import { 
  getUserProfile, 
  updateUserProfile, 
  uploadUserAvatar, 
  obtenerMisPublicaciones, 
  crearPublicacionServicio, 
  actualizarPublicacionServicio,
  eliminarPublicacionServicio,
  guardarHorariosMasivos,
  obtenerOficios
} from '../../services/api';

export default function MiPerfil() {
  const navigate = useNavigate();
  const { token } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Modales
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);

  // Datos principales
  const [userProfile, setUserProfile] = useState({});
  const [editForm, setEditForm] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [services, setServices] = useState([]);
  const [oficios, setOficios] = useState([]);

  // Formulario de Creación (con 3 fotos)
  const [newServiceForm, setNewServiceForm] = useState({
    titulo: '', precio_base: '', oficio_id: '', anos_experiencia: 0,
    descripcion: '', foto_url_1: '', foto_url_2: '', foto_url_3: ''
  });

  // Formulario de Edición (con 3 fotos)
  const [editServiceForm, setEditServiceForm] = useState({
    id: null, titulo: '', precio_base: '', oficio_id: '', anos_experiencia: 0,
    descripcion: '', foto_url_1: '', foto_url_2: '', foto_url_3: ''
  });

  // Calendario
  const [isConversable, setIsConversable] = useState(false);
  const [scheduleRange, setScheduleRange] = useState({ start: '', end: '' });
  const [generatedBlocks, setGeneratedBlocks] = useState([]);

  const MAX_BIO_LENGTH = 500;

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const oficiosData = await obtenerOficios();
        setOficios(oficiosData.oficios || []);

        const dbData = await getUserProfile(token);
        const avatarUrl = dbData.avatar_url || `https://ui-avatars.com/api/?background=2563eb&color=fff&name=${encodeURIComponent(dbData.nombres || 'Usuario')}`;

        setUserProfile({
          nombres: dbData.nombres || '',
          primer_apellido: dbData.primer_apellido || '',
          segundo_apellido: dbData.segundo_apellido || '',
          email: dbData.email || '',
          telefono: dbData.telefono || '',
          genero: dbData.genero || '',
          instagram_url: dbData.instagram_url || '',
          facebook_url: dbData.facebook_url || '',
          avatar: avatarUrl,
          rol: dbData.rol,
          titulo_oficio: dbData.titulo_oficio || 'Profesional independiente',
          experiencia: dbData.experiencia || 'Aún sin información',
          biografia: dbData.biografia || '',
          location: 'Chile',
          skills: 'Aún no registradas'
        });
        setEditForm({
          nombres: dbData.nombres || '',
          primer_apellido: dbData.primer_apellido || '',
          segundo_apellido: dbData.segundo_apellido || '',
          email: dbData.email || '',
          telefono: dbData.telefono || '',
          genero: dbData.genero || '',
          instagram_url: dbData.instagram_url || '',
          facebook_url: dbData.facebook_url || '',
          avatar: avatarUrl,
          rol: dbData.rol,
          titulo_oficio: dbData.titulo_oficio || 'Profesional independiente',
          experiencia: dbData.experiencia || 'Aún sin información',
          biografia: dbData.biografia || '',
          location: 'Chile',
          skills: 'Aún no registradas'
        });

        const pubData = await obtenerMisPublicaciones(token);
        const pubsConEstado = (pubData.publicaciones || []).map(p => ({ ...p, estado: p.estado || 'ACTIVA' }));
        setServices(pubsConEstado);

      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchAllData();
  }, [token]);

  // --- LÓGICA DE PERFIL ---
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setEditForm({ ...editForm, avatar: URL.createObjectURL(file) });
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    try {
      let finalAvatarUrl = editForm.avatar;
      if (avatarFile) {
        const uploadRes = await uploadUserAvatar(avatarFile, token);
        finalAvatarUrl = uploadRes.usuario?.avatar_url || uploadRes.avatar_url || editForm.avatar;
      }
      const payload = {
        telefono: editForm.telefono, genero: editForm.genero,
        instagram_url: editForm.instagram_url, facebook_url: editForm.facebook_url,
        avatar_url: finalAvatarUrl, titulo_oficio: editForm.titulo_oficio,
        experiencia: editForm.experiencia, biografia: editForm.biografia
      };
      await updateUserProfile(payload, token);
      setUserProfile((prev) => ({ ...prev, ...editForm, avatar: finalAvatarUrl }));
      setShowEditProfileModal(false);
      setAvatarFile(null);
    } catch (error) {
      setErrorMsg(error.message || 'Error al actualizar el perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- LÓGICA DE FOTOS (CREACIÓN Y EDICIÓN) ---
  const handlePhotoChange = (formType, num, e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (formType === 'create') {
        setNewServiceForm(prev => ({ ...prev, [`foto_url_${num}`]: url }));
      } else {
        setEditServiceForm(prev => ({ ...prev, [`foto_url_${num}`]: url }));
      }
    }
  };

  const removePhoto = (formType, num) => {
    if (formType === 'create') {
      setNewServiceForm(prev => ({ ...prev, [`foto_url_${num}`]: '' }));
    } else {
      setEditServiceForm(prev => ({ ...prev, [`foto_url_${num}`]: '' }));
    }
  };

  // --- LÓGICA DE CALENDARIO ---
  const handleGenerateBlocks = () => {
    if (!scheduleRange.start) { alert("Selecciona al menos la fecha de inicio."); return; }
    const startDate = new Date(scheduleRange.start + "T00:00:00");
    const endDate = scheduleRange.end ? new Date(scheduleRange.end + "T00:00:00") : new Date(startDate);
    if (startDate > endDate) { alert("La fecha de fin no puede ser menor a la de inicio."); return; }
    let current = new Date(startDate);
    const newBlocks = [];
    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      for (let i = 8; i < 17; i++) {
        newBlocks.push({
          id_temporal: `${dateStr}-${i}`, fecha: dateStr, fecha_visual: current.toLocaleDateString('es-CL'),
          hora_inicio: `${String(i).padStart(2, '0')}:00`, hora_fin: `${String(i+1).padStart(2, '0')}:00`
        });
      }
      current.setDate(current.getDate() + 1);
    }
    setGeneratedBlocks(newBlocks);
  };
  const removeBlock = (id_temporal) => setGeneratedBlocks(prev => prev.filter(b => b.id_temporal !== id_temporal));
  const blocksByDate = generatedBlocks.reduce((acc, block) => {
    if (!acc[block.fecha_visual]) acc[block.fecha_visual] = [];
    acc[block.fecha_visual].push(block);
    return acc;
  }, {});

  // --- CREAR SERVICIO ---
  const handleCreateService = async (e) => {
    e.preventDefault();
    setIsCreatingService(true);
    setErrorMsg(null);
    try {
      const pubRes = await crearPublicacionServicio({
        titulo: newServiceForm.titulo, descripcion: newServiceForm.descripcion,
        precio_base: Number(newServiceForm.precio_base), oficio_id: Number(newServiceForm.oficio_id),
        anos_experiencia: Number(newServiceForm.anos_experiencia), es_horario_conversable: isConversable,
        foto_url_1: newServiceForm.foto_url_1 || null,
        foto_url_2: newServiceForm.foto_url_2 || null,
        foto_url_3: newServiceForm.foto_url_3 || null
      }, token);

      const nuevaPubId = pubRes.publicacion.id;
      if (!isConversable && generatedBlocks.length > 0) {
        const bloquesFormateados = generatedBlocks.map(b => ({
          fecha_hora_inicio: `${b.fecha}T${b.hora_inicio}:00`, fecha_hora_fin: `${b.fecha}T${b.hora_fin}:00`
        }));
        await guardarHorariosMasivos(nuevaPubId, bloquesFormateados, token);
      }
      setServices([{ ...pubRes.publicacion, estado: 'ACTIVA' }, ...services]);
      setShowNewServiceModal(false);
      setNewServiceForm({ titulo: '', precio_base: '', oficio_id: '', anos_experiencia: 0, descripcion: '', foto_url_1: '', foto_url_2: '', foto_url_3: '' });
      setGeneratedBlocks([]); setScheduleRange({ start: '', end: '' }); setIsConversable(false);
    } catch (error) {
      setErrorMsg(error.message || 'Error al crear el servicio.');
    } finally {
      setIsCreatingService(false);
    }
  };

  // --- EDITAR SERVICIO ---
  const openEditModal = (pub) => {
    setEditServiceForm({
      id: pub.id,
      titulo: pub.titulo,
      precio_base: pub.precio_base,
      oficio_id: pub.oficio_id || '',
      anos_experiencia: pub.anos_experiencia || 0,
      descripcion: pub.descripcion,
      foto_url_1: pub.foto_url_1 || '',
      foto_url_2: pub.foto_url_2 || '',
      foto_url_3: pub.foto_url_3 || ''
    });
    setShowEditServiceModal(true);
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    try {
      const updatedPub = await actualizarPublicacionServicio(editServiceForm.id, {
        titulo: editServiceForm.titulo,
        descripcion: editServiceForm.descripcion,
        precio_base: Number(editServiceForm.precio_base),
        oficio_id: Number(editServiceForm.oficio_id),
        anos_experiencia: Number(editServiceForm.anos_experiencia),
        foto_url_1: editServiceForm.foto_url_1 || null,
        foto_url_2: editServiceForm.foto_url_2 || null,
        foto_url_3: editServiceForm.foto_url_3 || null
      }, token);

      setServices(services.map(s => s.id === editServiceForm.id ? { ...s, ...updatedPub.publicacion } : s));
      setShowEditServiceModal(false);
    } catch (error) {
      setErrorMsg(error.message || 'Error al actualizar el servicio.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- PAUSAR Y ELIMINAR (SOFT DELETE) ---
  const toggleServiceStatus = async (pub) => {
    const nuevoEstado = pub.estado === 'ACTIVA' ? 'PAUSADA' : 'ACTIVA';
    try {
      await actualizarPublicacionServicio(pub.id, { estado: nuevoEstado }, token);
      setServices(services.map(s => s.id === pub.id ? { ...s, estado: nuevoEstado } : s));
    } catch (error) {
      alert(error.message || 'Error al cambiar estado del servicio.');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este servicio? Se mantendrá tu historial por seguridad.')) return;
    try {
      await eliminarPublicacionServicio(id, token);
      setServices(services.filter(s => s.id !== id));
    } catch (error) {
      alert(error.message || 'Error al eliminar la publicación.');
    }
  };

  const fullName = `${userProfile.nombres || ''} ${userProfile.primer_apellido || ''} ${userProfile.segundo_apellido || ''}`.trim();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-slate-500 font-medium">Cargando tu perfil desde el servidor...</div>;
  const bioLength = editForm.biografia?.length || 0;
  const charsLeft = MAX_BIO_LENGTH - bioLength;
  const isCloseToLimit = charsLeft <= 20;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="h-48 md:h-60 relative overflow-hidden w-full" style={{ background: 'linear-gradient(135deg, #2563EB, #F97316)' }} />

      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 mb-8 relative z-10">
          <div className="flex items-end gap-5">
            <img src={userProfile.avatar} alt={fullName} className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-xl bg-white" />
            <div className="pb-1">
              <h1 className="text-2xl font-bold text-slate-900">{fullName}</h1>
              <p className="text-slate-500 text-sm font-medium text-orange-600">{userProfile.titulo_oficio} · <span className="text-slate-500">{userProfile.location}</span></p>
            </div>
          </div>
          <button onClick={() => { setEditForm(userProfile); setShowEditProfileModal(true); setAvatarFile(null); }} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white hover:bg-slate-50 cursor-pointer shadow-sm">
            Editar perfil
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-sm mb-4">Información de contacto</h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-3"><span>📧</span> <span className="truncate">{userProfile.email}</span></div>
                <div className="flex items-center gap-3"><span>📞</span> {userProfile.telefono || 'Sin teléfono'}</div>
                <div className="flex items-center gap-3"><span>🏗️</span> Experiencia: {userProfile.experiencia}</div>
                <div className="flex items-center gap-3"><span>👤</span> Género: {userProfile.genero === 'M' ? 'Masculino' : userProfile.genero === 'F' ? 'Femenino' : userProfile.genero === 'O' ? 'Otro' : 'No especificado'}</div>
                {userProfile.instagram_url && <div className="flex items-center gap-3"><span>📸</span> <a href={userProfile.instagram_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Instagram</a></div>}
                {userProfile.facebook_url && <div className="flex items-center gap-3"><span>📘</span> <a href={userProfile.facebook_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Facebook</a></div>}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-semibold text-slate-900 text-sm mb-3">Descripción profesional</h3>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{userProfile.biografia || 'Sin descripción aún.'}</p>
            </div>

            {/* Panel de Publicaciones */}
            {(userProfile.rol === 'PROFESIONAL' || userProfile.rol === 'CLIENTE') && (
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
                  {services.length === 0 ? (
                    <p className="text-xs text-slate-400 col-span-2 py-4 text-center">Aún no tienes servicios publicados.</p>
                  ) : (
                    services.map(pub => (
                      <div key={pub.id} className="rounded-2xl border border-slate-100 bg-white overflow-hidden hover:border-orange-200 hover:shadow-md transition-all flex flex-col">
                        <div className="h-32 w-full overflow-hidden relative bg-slate-100">
                          <img src={pub.foto_url_1 || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop'} alt={pub.titulo} className="w-full h-full object-cover" />
                          <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md text-white ${pub.estado === 'PAUSADA' ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                            {pub.estado || 'ACTIVA'}
                          </span>
                        </div>
                        <div className="p-4 flex flex-col flex-1 justify-between space-y-2">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{pub.titulo}</h4>
                              <span className="text-xs font-extrabold text-orange-600">${pub.precio_base?.toLocaleString('es-CL')}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-2">{pub.descripcion}</p>
                          </div>
                          
                          {/* BOTONES DE ACCIÓN: EDITAR, PAUSAR/ACTIVAR, ELIMINAR */}
                          <div className="grid grid-cols-3 gap-1 pt-3 border-t border-slate-50 mt-auto">
                            <button 
                              onClick={() => openEditModal(pub)}
                              className="py-1.5 text-[10px] font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-lg transition-colors cursor-pointer"
                            >
                              ✏️ Editar
                            </button>
                            <button 
                              onClick={() => toggleServiceStatus(pub)}
                              className={`py-1.5 text-[10px] font-bold rounded-lg border transition-colors cursor-pointer ${pub.estado === 'PAUSADA' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'}`}
                            >
                              {pub.estado === 'PAUSADA' ? '▶️ Activar' : '⏸️ Pausar'}
                            </button>
                            <button 
                              onClick={() => handleDeleteService(pub.id)}
                              className="py-1.5 text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-colors cursor-pointer"
                            >
                              🗑️ Eliminar
                            </button>
                          </div>

                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= MODALES ================= */}
      
      {/* 1. MODAL EDITAR PERFIL */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="font-bold text-slate-900 mb-4 border-b pb-2">Editar Información del Perfil</h3>
            {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">{errorMsg}</div>}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Foto de perfil</label>
                <div className="flex items-center gap-4">
                  <img src={editForm.avatar} alt="Avatar preview" className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-slate-50" />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Título u Oficio</label>
                  <input type="text" value={editForm.titulo_oficio} onChange={e => setEditForm({ ...editForm, titulo_oficio: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Años de experiencia</label>
                  <input type="text" value={editForm.experiencia} onChange={e => setEditForm({ ...editForm, experiencia: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-orange-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
                  <input type="text" value={editForm.telefono} onChange={e => setEditForm({ ...editForm, telefono: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Género</label>
                  <select value={editForm.genero} onChange={e => setEditForm({ ...editForm, genero: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-orange-500 bg-white">
                    <option value="">Prefiero no decirlo</option><option value="M">Masculino</option><option value="F">Femenino</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Biografía / Descripción</label>
                <textarea rows={4} maxLength={MAX_BIO_LENGTH} value={editForm.biografia} onChange={e => setEditForm({ ...editForm, biografia: e.target.value })} className={`w-full px-3.5 py-2.5 rounded-xl border outline-none resize-none ${isCloseToLimit ? 'border-red-300' : 'border-slate-200 focus:border-orange-500'}`} />
                <div className={`text-right text-[10px] mt-1 font-semibold ${isCloseToLimit ? 'text-red-500' : 'text-slate-400'}`}>{bioLength} / {MAX_BIO_LENGTH}</div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={isSaving} className="flex-1 py-3.5 rounded-xl text-white font-semibold transition-all hover:opacity-95 shadow-md disabled:opacity-70" style={{ background: '#F97316' }}>{isSaving ? 'Guardando...' : 'Guardar cambios'}</button>
                <button type="button" onClick={() => setShowEditProfileModal(false)} className="px-6 py-3.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. MODAL CREAR SERVICIO */}
      {showNewServiceModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh] space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">Crear Nuevo Servicio</h3>
              <button onClick={() => setShowNewServiceModal(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 font-bold text-xs cursor-pointer">✕</button>
            </div>
            {errorMsg && <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl">{errorMsg}</div>}
            
            <form onSubmit={handleCreateService} className="space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Título del servicio *</label>
                  <input type="text" required value={newServiceForm.titulo} onChange={e => setNewServiceForm({...newServiceForm, titulo: e.target.value})} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-orange-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Precio Base (CLP) *</label>
                    <input type="number" required value={newServiceForm.precio_base} onChange={e => setNewServiceForm({...newServiceForm, precio_base: e.target.value})} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-orange-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría / Oficio *</label>
                    <select required value={newServiceForm.oficio_id} onChange={e => setNewServiceForm({...newServiceForm, oficio_id: e.target.value})} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-orange-500 bg-white">
                      <option value="">Selecciona un oficio</option>
                      {oficios.map(oficio => (
                        <option key={oficio.id} value={oficio.id}>{oficio.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción detallada *</label>
                  <textarea rows={3} required value={newServiceForm.descripcion} onChange={e => setNewServiceForm({...newServiceForm, descripcion: e.target.value})} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-orange-500 resize-none" />
                </div>

                {/* Subida de 3 Fotos */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Fotos del servicio (Máximo 3)</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map(num => (
                      <div key={num} className="relative h-24 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center group">
                        {newServiceForm[`foto_url_${num}`] ? (
                          <>
                            <img src={newServiceForm[`foto_url_${num}`]} alt={`Foto ${num}`} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removePhoto('create', num)} className="absolute top-1 right-1 bg-red-500/90 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow hover:bg-red-600 cursor-pointer">✕</button>
                          </>
                        ) : (
                          <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-all">
                            <span className="text-2xl font-light mb-1">+</span>
                            <span className="text-[10px] font-semibold">Añadir foto</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoChange('create', num, e)} />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CALENDARIO MOCKUP */}
              <div className="pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-900 text-sm">📅 Sistema de Agendamiento</h4>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={isConversable} onChange={() => setIsConversable(!isConversable)} />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${isConversable ? 'bg-orange-500' : 'bg-slate-300'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isConversable ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-xs font-semibold text-slate-700">Trabajo a convenir</div>
                  </label>
                </div>

                {isConversable ? (
                  <div className="bg-slate-50 border-2 border-dashed border-slate-300 p-5 rounded-2xl text-center">
                    <h5 className="text-sm font-bold text-slate-700 mb-1">🤝 Modalidad: Horario a Convenir</h5>
                    <p className="text-xs text-slate-500 mb-0">Tus clientes verán un botón de WhatsApp para conversar presupuesto y tiempos contigo.</p>
                  </div>
                ) : (
                  <div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4">
                      <h6 className="mb-3 text-xs font-bold text-slate-800">🗓️ Generación Masiva (8:00 a 17:00 hrs)</h6>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Desde</label>
                          <input type="date" value={scheduleRange.start} onChange={e => setScheduleRange({...scheduleRange, start: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Hasta</label>
                          <input type="date" value={scheduleRange.end} onChange={e => setScheduleRange({...scheduleRange, end: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs" />
                        </div>
                        <button type="button" onClick={handleGenerateBlocks} className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-sm">⚡ Generar</button>
                      </div>
                    </div>

                    <div className="border border-slate-100 rounded-2xl p-4 bg-white max-h-64 overflow-y-auto">
                      <h6 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">Tus bloques generados:</h6>
                      {Object.keys(blocksByDate).length === 0 ? (
                        <div className="text-center text-slate-400 text-xs py-4">Aún no has generado horarios.</div>
                      ) : (
                        <div className="space-y-4">
                          {Object.keys(blocksByDate).map(dateStr => (
                            <div key={dateStr}>
                              <div className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold mb-2 shadow-sm">📅 Fecha: {dateStr}</div>
                              <div className="space-y-1.5 pl-2">
                                {blocksByDate[dateStr].map(block => (
                                  <div key={block.id_temporal} className="flex justify-between items-center p-2.5 border border-emerald-200 bg-emerald-50/30 rounded-xl">
                                    <div>
                                      <h6 className="text-xs font-bold text-slate-800 m-0">{block.hora_inicio} - {block.hora_fin}</h6>
                                      <span className="text-[9px] font-extrabold text-emerald-600 tracking-wider">DISPONIBLE</span>
                                    </div>
                                    <button type="button" onClick={() => removeBlock(block.id_temporal)} className="text-[10px] text-slate-500 border border-slate-200 bg-white font-semibold px-2 py-1 rounded-lg">Eliminar</button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button type="submit" disabled={isCreatingService} className="flex-1 py-3.5 rounded-xl text-white font-semibold text-sm shadow-md" style={{ background: '#F97316' }}>
                  {isCreatingService ? 'Guardando...' : 'Publicar servicio'}
                </button>
                <button type="button" onClick={() => setShowNewServiceModal(false)} className="px-6 py-3.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. MODAL EDITAR SERVICIO (CON 3 FOTOS) */}
      {showEditServiceModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh] space-y-4">
            <div className="flex items-center justify-between border-b pb-3 mb-2">
              <h3 className="font-bold text-slate-900 text-base">Editar Servicio</h3>
              <button onClick={() => setShowEditServiceModal(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 font-bold text-xs cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleUpdateService} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título del servicio *</label>
                <input type="text" required value={editServiceForm.titulo} onChange={e => setEditServiceForm({...editServiceForm, titulo: e.target.value})} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-orange-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Precio Base (CLP) *</label>
                  <input type="number" required value={editServiceForm.precio_base} onChange={e => setEditServiceForm({...editServiceForm, precio_base: e.target.value})} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría / Oficio *</label>
                  <select required value={editServiceForm.oficio_id} onChange={e => setEditServiceForm({...editServiceForm, oficio_id: e.target.value})} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-orange-500 bg-white">
                    <option value="">Selecciona un oficio</option>
                    {oficios.map(oficio => (
                      <option key={oficio.id} value={oficio.id}>{oficio.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción detallada *</label>
                <textarea rows={3} required value={editServiceForm.descripcion} onChange={e => setEditServiceForm({...editServiceForm, descripcion: e.target.value})} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-orange-500 resize-none" />
              </div>

              {/* Subida de 3 Fotos en Edición */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Fotos del servicio (Máximo 3)</label>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map(num => (
                    <div key={num} className="relative h-24 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center group">
                      {editServiceForm[`foto_url_${num}`] ? (
                        <>
                          <img src={editServiceForm[`foto_url_${num}`]} alt={`Foto ${num}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removePhoto('edit', num)} className="absolute top-1 right-1 bg-red-500/90 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow hover:bg-red-600 cursor-pointer">✕</button>
                        </>
                      ) : (
                        <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-all">
                          <span className="text-2xl font-light mb-1">+</span>
                          <span className="text-[10px] font-semibold">Añadir foto</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoChange('edit', num, e)} />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button type="submit" disabled={isSaving} className="flex-1 py-3.5 rounded-xl text-white font-semibold text-sm shadow-md" style={{ background: '#F97316' }}>
                  {isSaving ? 'Guardando...' : 'Actualizar servicio'}
                </button>
                <button type="button" onClick={() => setShowEditServiceModal(false)} className="px-6 py-3.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}