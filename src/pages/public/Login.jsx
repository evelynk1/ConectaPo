import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ConectaPoLogo from '../../components/Logo'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Redirigimos según el rol o al panel/home general
    navigate('/'); 
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Columna Izquierda: Banner decorativo */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12"
        style={{ background: 'linear-gradient(145deg, #1e40af, #2563EB)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="relative text-white max-w-sm">
          <div className="mb-8"><ConectaPoLogo height={52} inverted /></div>
          <h2 className="text-3xl font-extrabold mb-4" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            Bienvenido de vuelta a ConectaPo
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed">
            Accede a tu cuenta y gestiona tus servicios, contrataciones y perfil profesional.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            {['Gestiona tus solicitudes', 'Chatea con profesionales', 'Revisa tu historial'].map(item => (
              <div key={item} className="flex items-center gap-3 text-sm text-blue-100">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Columna Derecha: Formulario */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Acceso</p>
            <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Iniciar sesión</h1>
            <p className="text-slate-500 text-sm mt-1">¿No tienes cuenta?{' '}
              {/* Usamos Link en lugar de setScreen para ir a la vista de registro */}
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
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:shadow-lg"
              style={{ background: '#2563EB' }}>
              Iniciar sesión
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}