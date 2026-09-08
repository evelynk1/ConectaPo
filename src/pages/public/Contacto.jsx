import { useState } from 'react';

const Contacto = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: '',
    });

    const [enviado, setEnviado] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Por ahora solo mostramos confirmación visual.
        // Más adelante podemos conectarlo con el backend.
        setEnviado(true);

        setFormData({
            nombre: '',
            email: '',
            asunto: '',
            mensaje: '',
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-6xl mx-auto px-4">

                {/* Encabezado */}
                <div className="text-center mb-10">
                    <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
                        Estamos para ayudarte
                    </span>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Contáctanos
                    </h1>

                    <p className="text-gray-600 max-w-2xl mx-auto">
                        ¿Tienes alguna consulta, sugerencia o necesitas ayuda?
                        Escríbenos y nuestro equipo se pondrá en contacto contigo.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Información de contacto */}
                    <div className="space-y-5">

                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
                            <div className="text-4xl mb-4">
                                💬
                            </div>

                            <h2 className="text-xl font-bold mb-2">
                                ¿Necesitas ayuda?
                            </h2>

                            <p className="text-blue-100 text-sm leading-relaxed">
                                Estamos aquí para ayudarte con cualquier duda
                                relacionada con ConectaPo.
                            </p>
                        </div>

                        {/* Soporte */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center text-xl">
                                    🎫
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Soporte
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        ¿Tienes un problema? Nuestro equipo puede
                                        ayudarte.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Correo */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
                                    📧
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Correo electrónico
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        contacto@conectapo.cl
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Horario */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center text-xl">
                                    🕐
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Horario de atención
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Lunes a viernes
                                        <br />
                                        09:00 - 18:00 hrs
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Formulario */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">

                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Envíanos un mensaje
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Completa el formulario y cuéntanos cómo podemos ayudarte.
                                </p>
                            </div>

                            {enviado && (
                                <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-green-700 text-sm">
                                    <strong>¡Mensaje enviado!</strong>
                                    <br />
                                    Gracias por contactarnos. Te responderemos lo antes posible.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">

                                {/* Nombre y correo */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    <div>
                                        <label
                                            htmlFor="nombre"
                                            className="block text-sm font-semibold text-gray-700 mb-2"
                                        >
                                            Nombre completo
                                        </label>

                                        <input
                                            id="nombre"
                                            name="nombre"
                                            type="text"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            placeholder="Tu nombre"
                                            required
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-semibold text-gray-700 mb-2"
                                        >
                                            Correo electrónico
                                        </label>

                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="ejemplo@correo.com"
                                            required
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                </div>

                                {/* Asunto */}
                                <div>
                                    <label
                                        htmlFor="asunto"
                                        className="block text-sm font-semibold text-gray-700 mb-2"
                                    >
                                        Motivo de contacto
                                    </label>

                                    <select
                                        id="asunto"
                                        name="asunto"
                                        value={formData.asunto}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="">
                                            Selecciona un motivo
                                        </option>

                                        <option value="consulta">
                                            Consulta general
                                        </option>

                                        <option value="soporte">
                                            Soporte técnico
                                        </option>

                                        <option value="cuenta">
                                            Problema con mi cuenta
                                        </option>

                                        <option value="servicio">
                                            Problema con un servicio
                                        </option>

                                        <option value="sugerencia">
                                            Sugerencia
                                        </option>

                                        <option value="otro">
                                            Otro
                                        </option>
                                    </select>
                                </div>

                                {/* Mensaje */}
                                <div>
                                    <label
                                        htmlFor="mensaje"
                                        className="block text-sm font-semibold text-gray-700 mb-2"
                                    >
                                        Mensaje
                                    </label>

                                    <textarea
                                        id="mensaje"
                                        name="mensaje"
                                        value={formData.mensaje}
                                        onChange={handleChange}
                                        placeholder="Cuéntanos cómo podemos ayudarte..."
                                        rows="6"
                                        required
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm resize-none outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                {/* Botón */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="w-full md:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md"
                                    >
                                        Enviar mensaje
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contacto;