import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/useUser';
import { getUserProfile, updateUserProfile, uploadUserAvatar } from '../../services/api';

export default function MiPerfil() {
  const navigate = useNavigate();
  const { user, token } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [editForm, setEditForm] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);

  const MAX_BIO_LENGTH = 500;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const dbData = await getUserProfile(token);

        const profileData = {
          nombres: dbData.nombres || '',
          primer_apellido: dbData.primer_apellido || '',
          segundo_apellido: dbData.segundo_apellido || '',
          email: dbData.email || '',
          telefono: dbData.telefono || '',
          genero: dbData.genero || '',
          instagram_url: dbData.instagram_url || '',
          facebook_url: dbData.facebook_url || '',
          avatar: dbData.avatar_url || `https://ui-avatars.com/api/?background=2563eb&color=fff&name=${encodeURIComponent(dbData.nombres || 'Usuario')}`,
          rol: dbData.rol,
          titulo_oficio: dbData.titulo_oficio || (dbData.rol === 'PROFESIONAL' ? 'Profesional' : 'Cliente'),
          experiencia: dbData.experiencia || 'Aún sin información',
          biografia: dbData.biografia || '',
          location: 'Chile',
          skills: 'Aún no registradas'
        };

        setUserProfile(profileData);
        setEditForm(profileData);
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

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
        finalAvatarUrl = uploadRes.usuario.avatar_url;
      }

      const payload = {
        telefono: editForm.telefono,
        genero: editForm.genero,
        instagram_url: editForm.instagram_url,
        facebook_url: editForm.facebook_url,
        avatar_url: finalAvatarUrl,
        titulo_oficio: editForm.titulo_oficio,
        experiencia: editForm.experiencia,
        biografia: editForm.biografia
      };

      await updateUserProfile(payload, token);

      setUserProfile((prev) => ({
        ...prev,
        ...editForm,
        avatar: finalAvatarUrl
      }));

      setShowEditProfileModal(false);
      setAvatarFile(null);
    } catch (error) {
      setErrorMsg(error.message || 'Error al actualizar el perfil o subir la foto.');
    } finally {
      setIsSaving(false);
    }
  };

  const fullName = `${userProfile.nombres || ''} ${userProfile.primer_apellido || ''} ${userProfile.segundo_apellido || ''}`.trim();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500 font-medium">Cargando tu perfil desde el servidor...</div>;
  }

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
          </div>
        </div>
      </div>

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
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre completo (Verificado)</label>
                  <input type="text" value={fullName} disabled className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Correo electrónico (Verificado)</label>
                  <input type="email" value={editForm.email} disabled className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Título u Oficio</label>
                  <input type="text" value={editForm.titulo_oficio} onChange={e => setEditForm({ ...editForm, titulo_oficio: e.target.value })} placeholder="Ej: Gasfíter Certificado" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Años de experiencia</label>
                  <input type="text" value={editForm.experiencia} onChange={e => setEditForm({ ...editForm, experiencia: e.target.value })} placeholder="Ej: 5 años" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
                  <input type="text" value={editForm.telefono} onChange={e => setEditForm({ ...editForm, telefono: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Género</label>
                  <select value={editForm.genero} onChange={e => setEditForm({ ...editForm, genero: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all bg-white">
                    <option value="">Prefiero no decirlo</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="O">Otro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Instagram (URL)</label>
                  <input type="url" value={editForm.instagram_url} onChange={e => setEditForm({ ...editForm, instagram_url: e.target.value })} placeholder="https://instagram.com/..." className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Facebook (URL)</label>
                  <input type="url" value={editForm.facebook_url} onChange={e => setEditForm({ ...editForm, facebook_url: e.target.value })} placeholder="https://facebook.com/..." className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Biografía / Descripción</label>
                <textarea
                  rows={4}
                  maxLength={MAX_BIO_LENGTH}
                  value={editForm.biografia}
                  onChange={e => setEditForm({ ...editForm, biografia: e.target.value })}
                  placeholder="Cuéntale a tus clientes sobre ti y tu forma de trabajar..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none focus:ring-2 transition-all resize-none ${isCloseToLimit ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-orange-500 focus:ring-orange-100'}`}
                />
                <div className={`text-right text-[10px] mt-1 font-semibold ${isCloseToLimit ? 'text-red-500' : 'text-slate-400'}`}>
                  {bioLength} / {MAX_BIO_LENGTH} caracteres {isCloseToLimit && '(Límite cercano)'}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={isSaving} className="flex-1 py-3.5 rounded-xl text-white font-semibold transition-all hover:opacity-95 shadow-md disabled:opacity-70 disabled:cursor-not-allowed" style={{ background: '#F97316' }}>
                  {isSaving ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button type="button" onClick={() => { setShowEditProfileModal(false); setAvatarFile(null); }} className="px-6 py-3.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}