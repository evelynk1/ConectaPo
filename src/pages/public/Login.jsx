import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ConectaPoLogo from '../../components/Logo';
import { useUser } from '../../context/useUser';
import { loginUser } from '../../services/api';
import ModalRecuperarPassword from '../../components/ModalRecuperarPassword'; // <-- IMPORTADO

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  // ESTADOS DE CONTROL
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // ESTADO PARA EL MODAL DE RECUPERAR
  const [showRecuperarModal, setShowRecuperarModal] = useState(false); // <-- AGREGADO

  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const { user, token } = await loginUser({ email, password: pass });
      login(user, token);

      if (user.rol === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/panel/perfil');
      }
    } catch (error) {
      setErrorMsg(error.message || 'Error inesperado al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* COLUMNA IZQUIERDA */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 bg-blue-800"
        style={{ background: 'linear-gradient(145deg, #1e40af, #2563EB)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="relative text-white max-w-sm">
          <div className="mb-8"><ConectaPoLogo height={52} inverted /></div>
          <h2 className="text-3xl font-extrabold mb-4">Bienvenido de vuelta a ConectaPo</h2>
          <p className="text-blue-200 text-sm leading-relaxed">Accede a tu cuenta y gestiona tus servicios, contrataciones y perfil profesional.</p>
        </div>
      </div>

      {/* COLUMNA DERECHA */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Acceso</p>
            <h1 className="text-2xl font-bold text-slate-900">Iniciar sesión</h1>
            <p className="text-slate-500 text-sm mt-1">¿No tienes cuenta?{' '}
              <Link to="/registro" className="font-semibold text-blue-600 hover:text-blue-700">Regístrate</Link>
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
              ❌ {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Correo electrónico</label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                disabled={isLoading}
                placeholder="tuemail@ejemplo.cl"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all disabled:opacity-50 disabled:bg-slate-50"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">Contraseña</label>
                {/* BOTÓN CON ONCLICK AGREGADO */}
                <button
                  type="button"
                  onClick={() => setShowRecuperarModal(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <input
                value={pass}
                onChange={e => setPass(e.target.value)}
                type="password"
                disabled={isLoading}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all disabled:opacity-50 disabled:bg-slate-50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all bg-blue-600 hover:bg-blue-700 hover:shadow-lg flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* RENDERIZAMOS EL MODAL AQUÍ */}
      {showRecuperarModal && (
        <ModalRecuperarPassword onClose={() => setShowRecuperarModal(false)} />
      )}
    </div>
  );
}