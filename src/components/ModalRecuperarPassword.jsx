import { useState } from 'react';
import { solicitarRecuperacionPass, resetearPassword } from '../services/api';

export default function ModalRecuperarPassword({ onClose }) {
    // Estados para el flujo
    const [paso, setPaso] = useState(1); // 1: Solicitar teléfono, 2: Ingresar nueva clave
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // Datos del formulario
    const [telefono, setTelefono] = useState('');
    const [token, setToken] = useState('');
    const [linkSimulado, setLinkSimulado] = useState('');
    const [nuevaPassword, setNuevaPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');

    // ==========================================
    // PASO 1: ENVIAR TELÉFONO
    // ==========================================
    const handleSolicitar = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);
        try {
            const res = await solicitarRecuperacionPass(telefono);
            // Guardamos el token y el link que responde el backend
            setToken(res.token);
            setLinkSimulado(res.linkSimulado);
            setPaso(2); // Avanzamos al paso 2
        } catch (error) {
            setErrorMsg(error.message || 'Error al solicitar recuperación. Verifica el número.');
        } finally {
            setIsLoading(false);
        }
    };

    // ==========================================
    // PASO 2: GUARDAR NUEVA CONTRASEÑA
    // ==========================================
    const handleResetear = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);

        // Validación rápida en el frontend
        if (nuevaPassword !== confirmarPassword) {
            setErrorMsg('Las contraseñas no coinciden.');
            setIsLoading(false);
            return;
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(nuevaPassword)) {
            setErrorMsg('La contraseña debe tener al menos 6 caracteres, incluyendo letras y números.');
            setIsLoading(false);
            return;
        }

        try {
            await resetearPassword(token, nuevaPassword);
            setSuccessMsg('¡Contraseña actualizada con éxito! Ya puedes iniciar sesión.');
            // Ocultamos el formulario para mostrar solo el mensaje de éxito
            setPaso(3);
        } catch (error) {
            setErrorMsg(error.message || 'Error al restablecer la contraseña.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
                {/* Botón de cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 font-bold"
                >
                    ✕
                </button>

                {/* PASO 1: Ingresar Teléfono */}
                {paso === 1 && (
                    <form onSubmit={handleSolicitar} className="space-y-4 pt-2">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Recuperar contraseña</h3>
                            <p className="text-sm text-slate-500 mt-1">Ingresa el teléfono registrado en tu cuenta</p>
                        </div>

                        {errorMsg && <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl">{errorMsg}</div>}

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Número de teléfono</label>
                            <input
                                type="text"
                                required
                                placeholder="Ej: 912345678"
                                value={telefono}
                                onChange={e => setTelefono(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-70 mt-2"
                        >
                            {isLoading ? 'Buscando...' : 'Enviar link a WhatsApp'}
                        </button>
                    </form>
                )}

                {/* PASO 2: Simulación de WhatsApp y Nueva Clave */}
                {paso === 2 && (
                    <form onSubmit={handleResetear} className="space-y-4 pt-2">
                        <div className="text-center mb-4">
                            <span className="text-4xl">💬</span>
                            <h3 className="text-lg font-bold text-slate-900 mt-2">Mensaje enviado a tu WhatsApp</h3>
                            <p className="text-xs text-slate-500 mt-1">Simulación exitosa. Este es el link que habrías recibido:</p>
                        </div>

                        {/* Caja que simula el mensaje */}
                        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-[10px] text-emerald-800 break-all text-center mb-4">
                            {linkSimulado}
                        </div>

                        {errorMsg && <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl">{errorMsg}</div>}

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Nueva Contraseña</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="Mínimo 6 caracteres (letras y números)"
                                    value={nuevaPassword}
                                    onChange={e => setNuevaPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="Repite la contraseña"
                                    value={confirmarPassword}
                                    onChange={e => setConfirmarPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-70 mt-2"
                        >
                            {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
                        </button>
                    </form>
                )}

                {/* PASO 3: ÉXITO */}
                {paso === 3 && (
                    <div className="text-center py-6">
                        <span className="text-5xl">✅</span>
                        <h3 className="text-xl font-bold text-slate-900 mt-4">¡Listo!</h3>
                        <p className="text-sm text-slate-500 mt-2 mb-6">{successMsg}</p>
                        <button
                            onClick={onClose}
                            className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700"
                        >
                            Ir a Iniciar Sesión
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}