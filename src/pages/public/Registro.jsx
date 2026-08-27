import { useState } from 'react'
import ConectaPoLogo from '../../components/Logo'

export default function Registro({ setScreen }) {
  // Estado para controlar si el usuario aceptó los términos y condiciones
  const [terms, setTerms] = useState(false)
  
  // Estado único para manejar los campos del formulario de registro
  const [form, setForm] = useState({ name: '', email: '', phone: '', pass: '' })

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* ---------------------------------------------------- */}
      {/* PANEL IZQUIERDO: Branding, estadísticas y decorativo */}
      {/* ---------------------------------------------------- */}
      <div className="hidden lg:flex lg:w-5/12 relative items-center justify-center p-12"
        style={{ background: 'linear-gradient(145deg, #ea580c, #F97316)' }}>
        
        {/* Patrón de puntos decorativo de fondo */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        
        <div className="relative text-white max-w-sm">
          {/* Logo institucional con color invertido */}
          <div className="mb-8"><ConectaPoLogo height={52} inverted /></div>
          
          <h2 className="text-3xl font-extrabold mb-4" style={{ fontFamily: 'Plus Jakarta Sans' }}>Únete a ConectaPo</h2>
          
          <p className="text-orange-100 text-sm leading-relaxed">
            El marketplace líder de oficios y servicios en Chile. Regístrate gratis y empieza hoy.
          </p>
          
          {/* Tarjetas de estadísticas del marketplace */}
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
          
          {/* Encabezado y enlace para cambiar a inicio de sesión */}
          <div className="mb-8">
            <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-2">Crear cuenta</p>
            <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Regístrate gratis</h1>
            <p className="text-slate-500 text-sm mt-1">¿Ya tienes cuenta?{' '}
              <button onClick={() => setScreen('login')} className="font-semibold text-blue-600 hover:text-blue-700">Inicia sesión</button>
            </p>
          </div>

          {/* Campos del formulario */}
          <div className="space-y-4">
            {/* Input de Nombre Completo */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nombre completo</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Juan Pérez García"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>

            {/* Input de Correo Electrónico */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Correo electrónico</label>
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                type="email" placeholder="juan@ejemplo.cl"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>

            {/* Input de Teléfono con prefijo de Chile (+56) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Teléfono</label>
              <div className="flex gap-2">
                <span className="px-3 py-3 rounded-xl border border-slate-200 text-sm text-slate-600 bg-slate-50 shrink-0">+56</span>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="9 1234 5678" type="tel"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>
            </div>

            {/* Input de Contraseña */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contraseña</label>
              <input value={form.pass} onChange={e => setForm({ ...form, pass: e.target.value })}
                type="password" placeholder="Mínimo 8 caracteres"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>

            {/* Casilla de aceptación de Términos y Condiciones */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 cursor-pointer" style={{ accentColor: '#2563EB' }} />
              <span className="text-xs text-slate-600 leading-relaxed">
                Acepto los{' '}
                <a href="#" className="text-blue-600 font-semibold hover:underline">Términos y Condiciones</a>{' '}
                y la{' '}
                <a href="#" className="text-blue-600 font-semibold hover:underline">Política de Privacidad</a>
                {' '}de ConectaPo.
              </span>
            </label>

            {/* Botón principal de envío */}
            <button onClick={() => setScreen('profile')}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:shadow-lg mt-2 cursor-pointer"
              style={{ background: '#F97316' }}>
              Registrarse gratis
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}