import { useState } from 'react'
import { useUser } from '../../context/useUser'

const Login = () => {
    const { login } = useUser()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        /*
          Aquí se conectará más adelante el backend real.

          Ejemplo futuro:

          const response = await fetch(...)
          const data = await response.json()

          login(data.user, data.token)
        */

        console.log('Email:', email)
        console.log('Password:', password)
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">

            <h1 className="text-2xl font-bold text-gray-700 mb-6">
                Iniciar sesión
            </h1>

            <form onSubmit={handleSubmit}>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Correo electrónico
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="correo@ejemplo.cl"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Contraseña
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="Contraseña"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                    Iniciar sesión
                </button>

            </form>

        </div>
    )
}

export default Login