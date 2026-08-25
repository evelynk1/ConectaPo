import { useUser } from '../../context/useUser'

const Login = () => {
    const { user, login, logout } = useUser()

    const iniciarSesion = () => {
        login(
            {
                name: 'Usuario Prueba',
                email: 'usuario@conectapo.cl',
                rol: 'USUARIO'
            },
            'token-prueba-123'
        )
    }

    return (
        <div className="p-4 text-2xl font-bold text-gray-700">

            <h1>Vista login</h1>

            {user ? (
                <>
                    <p className="mt-4">
                        Usuario conectado: {user.name}
                    </p>

                    <button
                        onClick={logout}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                    >
                        Cerrar sesión
                    </button>
                </>
            ) : (
                <button
                    onClick={iniciarSesion}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Iniciar sesión de prueba
                </button>
            )}

        </div>
    )
}

export default Login