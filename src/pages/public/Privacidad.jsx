export default function Privacidad() {
    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-4xl mx-auto px-4">

                {/* Encabezado */}
                <div className="text-center mb-10">
                    <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
                        Protección de datos
                    </span>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Política de Privacidad
                    </h1>

                    <p className="text-gray-500 text-sm">
                        Última actualización: septiembre de 2026
                    </p>
                </div>

                {/* Contenido */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-10">

                    <div className="space-y-8">

                        {/* Introducción */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">
                                1. Introducción
                            </h2>

                            <p className="text-gray-600 leading-relaxed">
                                En ConectaPo nos preocupamos por la privacidad de
                                nuestros usuarios y por el uso responsable de la
                                información proporcionada al utilizar la plataforma.
                            </p>

                            <p className="text-gray-600 leading-relaxed mt-3">
                                Esta Política de Privacidad explica qué información
                                puede recopilar ConectaPo, para qué puede utilizarse
                                y cuáles son los derechos de los usuarios respecto
                                de sus datos.
                            </p>
                        </section>

                        {/* Información recopilada */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">
                                2. Información que recopilamos
                            </h2>

                            <p className="text-gray-600 leading-relaxed mb-3">
                                Dependiendo de las funcionalidades utilizadas,
                                ConectaPo puede recopilar información como:
                            </p>

                            <ul className="list-disc pl-6 space-y-2 text-gray-600">
                                <li>Nombre y datos básicos del usuario.</li>
                                <li>Dirección de correo electrónico.</li>
                                <li>Información asociada a la cuenta.</li>
                                <li>Información de perfil profesional.</li>
                                <li>Información relacionada con servicios publicados.</li>
                                <li>Mensajes o solicitudes realizadas dentro de la plataforma.</li>
                            </ul>
                        </section>

                        {/* Uso */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">
                                3. Uso de la información
                            </h2>

                            <p className="text-gray-600 leading-relaxed mb-3">
                                La información recopilada puede utilizarse para:
                            </p>

                            <ul className="list-disc pl-6 space-y-2 text-gray-600">
                                <li>Crear y administrar cuentas de usuario.</li>
                                <li>Permitir el funcionamiento de las funcionalidades de ConectaPo.</li>
                                <li>Facilitar la conexión entre usuarios y profesionales.</li>
                                <li>Gestionar solicitudes y servicios.</li>
                                <li>Proporcionar soporte a los usuarios.</li>
                                <li>Mejorar la experiencia y funcionamiento de la plataforma.</li>
                                <li>Prevenir usos indebidos o actividades fraudulentas.</li>
                            </ul>
                        </section>

                        {/* Datos profesionales */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">
                                4. Información de los profesionales
                            </h2>

                            <p className="text-gray-600 leading-relaxed">
                                Los profesionales pueden publicar información relacionada
                                con sus servicios, experiencia, ubicación, disponibilidad
                                y otros datos necesarios para que los usuarios puedan
                                conocer y evaluar sus servicios.
                            </p>

                            <p className="text-gray-600 leading-relaxed mt-3">
                                El profesional es responsable de proporcionar información
                                correcta y apropiada para su publicación dentro de la
                                plataforma.
                            </p>
                        </section>

                        {/* Compartición */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">
                                5. Compartición de información
                            </h2>

                            <p className="text-gray-600 leading-relaxed">
                                ConectaPo no busca comercializar los datos personales
                                de sus usuarios. La información podrá utilizarse o
                                compartirse cuando sea necesario para proporcionar
                                las funcionalidades de la plataforma, cumplir
                                obligaciones aplicables o proteger la seguridad
                                de los usuarios y del servicio.
                            </p>
                        </section>

                        {/* Seguridad */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">
                                6. Seguridad de la información
                            </h2>

                            <p className="text-gray-600 leading-relaxed">
                                ConectaPo busca implementar medidas razonables para
                                proteger la información de los usuarios frente a
                                accesos no autorizados, pérdida, modificación o
                                uso indebido.
                            </p>

                            <p className="text-gray-600 leading-relaxed mt-3">
                                Sin embargo, ningún sistema conectado a Internet
                                puede garantizar una seguridad absoluta.
                            </p>
                        </section>

                        {/* Cookies */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">
                                7. Cookies y tecnologías similares
                            </h2>

                            <p className="text-gray-600 leading-relaxed">
                                ConectaPo puede utilizar tecnologías de almacenamiento
                                local o mecanismos similares para mantener sesiones,
                                recordar determinadas preferencias y permitir el
                                correcto funcionamiento de la plataforma.
                            </p>
                        </section>

                        {/* Conservación */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">
                                8. Conservación de los datos
                            </h2>

                            <p className="text-gray-600 leading-relaxed">
                                La información podrá conservarse durante el tiempo
                                necesario para proporcionar los servicios de
                                ConectaPo, mantener registros de la plataforma,
                                resolver solicitudes de soporte o cumplir con
                                las obligaciones correspondientes.
                            </p>
                        </section>

                        {/* Derechos */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">
                                9. Derechos de los usuarios
                            </h2>

                            <p className="text-gray-600 leading-relaxed">
                                Los usuarios pueden solicitar información sobre
                                los datos asociados a su cuenta y, cuando corresponda,
                                solicitar su actualización, corrección o eliminación.
                            </p>

                            <p className="text-gray-600 leading-relaxed mt-3">
                                Para realizar una consulta relacionada con la
                                información personal, el usuario puede comunicarse
                                con ConectaPo mediante la página de contacto.
                            </p>
                        </section>

                        {/* Menores */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">
                                10. Menores de edad
                            </h2>

                            <p className="text-gray-600 leading-relaxed">
                                ConectaPo está orientado a personas que cuentan con
                                capacidad para utilizar los servicios ofrecidos por
                                la plataforma. No se busca recopilar deliberadamente
                                información personal de menores de edad.
                            </p>
                        </section>

                        {/* Cambios */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">
                                11. Cambios en esta política
                            </h2>

                            <p className="text-gray-600 leading-relaxed">
                                Esta Política de Privacidad puede actualizarse para
                                reflejar cambios en las funcionalidades de ConectaPo
                                o en la forma en que se gestiona la información.
                            </p>

                            <p className="text-gray-600 leading-relaxed mt-3">
                                La fecha de actualización indicada al comienzo de
                                esta página permite identificar la versión más
                                reciente de la política.
                            </p>
                        </section>

                        {/* Contacto */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3">
                                12. Contacto
                            </h2>

                            <p className="text-gray-600 leading-relaxed">
                                Si tienes preguntas sobre esta Política de Privacidad
                                o sobre el tratamiento de información dentro de
                                ConectaPo, puedes comunicarte con nosotros mediante
                                la página de contacto.
                            </p>
                        </section>

                    </div>

                    {/* Nota */}
                    <div className="mt-10 pt-6 border-t border-gray-100">
                        <p className="text-xs text-gray-400 leading-relaxed">
                            Esta política forma parte de la presentación académica
                            del proyecto ConectaPo y tiene carácter informativo.
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
}

