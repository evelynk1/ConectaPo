import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ConectaPoLogo from '../../components/Logo';
import { useUser } from '../../context/useUser'; // <-- el hook del contexto

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  // const { login } = useUser(); // <-- 2. Extraemos la función login

  const handleLogin = (e) => {
    e.preventDefault();

    // // aquí irá el fetch a la API
    // const mockUser = {
    //   id: 1,
    //   name: 'Usuario Prueba',
    //   email: email,
    //   rol: email.includes('admin') ? 'ADMIN' : 'USUARIO' // Truco rápido para probar roles
    // };
    const mockToken = 'eyJhGciOiJIUzI1NiIsInR5...';

    // 4. Guardamos en el contexto (y por ende en localStorage)
    login(mockUser, mockToken);

    // 5. Redirigimos según el rol
    if (mockUser.rol === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/panel/perfil');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Columna Izquierda: Banner decorativo (Se mantiene igual) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 bg-blue-800"
        style={{ background: 'linear-gradient(145deg, #1e40af, #2563EB)' }}>
        {/* ... (El interior de esta columna queda exactamente igual al código original) ... */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="relative text-white max-w-sm">
          <div className="mb-8"><ConectaPoLogo height={52} inverted /></div>
          <h2 className="text-3xl font-extrabold mb-4">Bienvenido de vuelta a ConectaPo</h2>
          <p className="text-blue-200 text-sm leading-relaxed">Accede a tu cuenta y gestiona tus servicios, contrataciones y perfil profesional.</p>
        </div>
      </div>

      {/* Columna Derecha: Formulario */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Acceso</p>
            <h1 className="text-2xl font-bold text-slate-900">Iniciar sesión</h1>
            <p className="text-slate-500 text-sm mt-1">¿No tienes cuenta?{' '}
              <Link to="/registro" className="font-semibold text-blue-600 hover:text-blue-700">Regístrate</Link>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Correo electrónico</label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                placeholder="tuemail@ejemplo.cl"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">Contraseña</label>
                <button type="button" className="text-xs text-blue-600 hover:text-blue-700 font-medium">¿Olvidaste tu contraseña?</button>
              </div>
              <input
                value={pass}
                onChange={e => setPass(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              // <-- Se reemplaza el style por bg-blue-600
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all bg-blue-600 hover:bg-blue-700 hover:shadow-lg">
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}