import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ConectaPoLogo from '../../components/Logo'

export default function Registro() {
  const [terms, setTerms] = useState(false)
  const [form, setForm] = useState({ nombre: '', correo: '', telefono: '', password: '' })
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault(); // Evita que la página recargue

    if (!terms) {
      alert("Debes aceptar los términos y condiciones para continuar.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al registrar el usuario');
      }

      alert("¡Registro exitoso! Por favor inicia sesión.");
      navigate('/login');
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* ---------------------------------------------------- */}
      {/* PANEL IZQUIERDO: Branding, estadísticas y decorativo */}
      {/* ---------------------------------------------------- */}
      <div className="hidden lg:flex lg:w-5/12 relative items-center justify-center p-12 bg-gradient-to-br from-orange-600 to-orange-500">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />

        <div className="relative text-white max-w-sm">
          <div className="mb-8"><ConectaPoLogo height={52} inverted /></div>
          <h2 className="text-3xl font-extrabold mb-4" style={{ fontFamily: 'Plus Jakarta Sans' }}>Únete a ConectaPo</h2>
          <p className="text-orange-100 text-sm leading-relaxed">
            El marketplace líder de oficios y servicios en Chile. Regístrate gratis y empieza hoy.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {[['2.400+', 'Profesionales'], ['50+', 'Categorías'], ['15.000+', 'Proyectos'], ['98%', 'Satisfacción']].map(([n, l]) => (
              <div key={l} className="bg-white/15 rounded-xl p-4 text-center">
                <div className="text-xl font-extrabold" style={{ fontFamily: 'Plus Jakarta Sans' }}>{n}</div>
                <div className="text-xs text-orange-200 mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* PANEL DERECHO: Formulario interactivo de registro   */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-2">Crear cuenta</p>
            <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Regístrate gratis</h1>
            <p className="text-slate-500 text-sm mt-1">¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">Inicia sesión</Link>
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nombre completo</label>
              <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                required
                placeholder="Juan Pérez García"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Correo electrónico</label>
              <input value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })}
                required
                type="email" placeholder="juan@ejemplo.cl"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Teléfono</label>
              <div className="flex gap-2">
                <span className="px-3 py-3 rounded-xl border border-slate-200 text-sm text-slate-600 bg-slate-50 shrink-0">+56</span>
                <input value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })}
                  required
                  placeholder="9 1234 5678" type="tel"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contraseña</label>
              <input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                required minLength={8}
                type="password" placeholder="Mínimo 8 caracteres"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 cursor-pointer accent-blue-600" />
              <span className="text-xs text-slate-600 leading-relaxed">
                Acepto los{' '}
                <a href="#" className="text-blue-600 font-semibold hover:underline">Términos y Condiciones</a>{' '}
                y la{' '}
                <a href="#" className="text-blue-600 font-semibold hover:underline">Política de Privacidad</a>
                {' '}de ConectaPo.
              </span>
            </label>

            <button type="submit"
              className="w-full py-3.5 rounded-xl text-white bg-orange-500 font-semibold text-sm transition-all hover:bg-orange-600 hover:shadow-lg mt-2 cursor-pointer">
              Registrarse gratis
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}