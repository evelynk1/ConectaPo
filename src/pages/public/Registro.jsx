import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ConectaPoLogo from '../../components/Logo'
import { registerUser } from '../../services/api'

export default function Registro() {
  const [terms, setTerms] = useState(false)

  const [form, setForm] = useState({
    nombres: '',
    primer_apellido: '',
    rut: '',
    email: '',
    telefono: '',
    password: '',
    rol: 'CLIENTE'
  })

  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!terms) {
      alert('Debes aceptar los términos y condiciones para continuar.')
      return
    }

    try {
      await registerUser(form)

      alert('¡Registro exitoso! Ahora puedes iniciar sesión.')
      navigate('/login')
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link to="/" aria-label="Ir al inicio">
            <ConectaPoLogo height={48} />
          </Link>
        </div>

        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Crear cuenta
          </h1>

          <p className="text-slate-500 mt-2">
            Regístrate en ConectaPo y encuentra los mejores servicios.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleRegister} className="space-y-5">

          {/* Nombres */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Nombres
            </label>

            <input
              type="text"
              value={form.nombres}
              onChange={(e) =>
                setForm({ ...form, nombres: e.target.value })
              }
              required
              placeholder="Ingresa tus nombres"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Primer apellido */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Primer apellido
            </label>

            <input
              type="text"
              value={form.primer_apellido}
              onChange={(e) =>
                setForm({ ...form, primer_apellido: e.target.value })
              }
              required
              placeholder="Ingresa tu primer apellido"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* RUT */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              RUT
            </label>

            <input
              type="text"
              value={form.rut}
              onChange={(e) =>
                setForm({ ...form, rut: e.target.value })
              }
              required
              placeholder="Ej: 12.345.678-9"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Correo electrónico
            </label>

            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
              placeholder="correo@ejemplo.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Teléfono
            </label>

            <input
              type="tel"
              value={form.telefono}
              onChange={(e) =>
                setForm({ ...form, telefono: e.target.value })
              }
              required
              placeholder="+56 9 1234 5678"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Contraseña
            </label>

            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
              minLength={6}
              placeholder="Contraseña"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-1 text-xs text-slate-500">
              La contraseña debe tener al menos 6 caracteres, incluyendo letras y números.
            </p>
          </div>

          {/* Tipo de usuario */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Tipo de cuenta
            </label>

            <select
              value={form.rol}
              onChange={(e) =>
                setForm({ ...form, rol: e.target.value })
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="CLIENTE">
                Cliente
              </option>

              <option value="PROFESIONAL">
                Profesional
              </option>
            </select>
          </div>

          {/* Términos */}
          <div className="flex items-start gap-3 pt-2">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="mt-1 h-4 w-4 cursor-pointer"
            />

            <span className="text-sm text-slate-600">
              Acepto los{' '}
              <Link
                to="/terminos"
                className="text-blue-600 font-semibold hover:underline"
              >
                Términos y Condiciones
              </Link>{' '}
              y la{' '}
              <Link
                to="/privacidad"
                className="text-blue-600 font-semibold hover:underline"
              >
                Política de Privacidad
              </Link>{' '}
              de ConectaPo.
            </span>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Crear cuenta
          </button>
        </form>

        {/* Login */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            ¿Ya tienes una cuenta?{' '}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}