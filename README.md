<<<<<<< HEAD
# ConectaPo

> Marketplace de servicios y oficios en Chile.

## Descripción del proyecto

ConectaPo es una aplicación web que busca conectar clientes con profesionales de distintos oficios y servicios de manera simple y gratuita.

La plataforma permitirá a los usuarios buscar servicios según su oficio y comuna, revisar publicaciones, consultar disponibilidad y contactar directamente al profesional mediante WhatsApp.

---

# Objetivo

Desarrollar una plataforma web que facilite la conexión entre personas que necesitan un servicio y profesionales que ofrecen sus servicios, incorporando un sistema de disponibilidad, reputación y moderación.

---

# Usuarios

## Cliente

El cliente podrá:

- Buscar servicios.
- Filtrar servicios por oficio y comuna.
- Revisar publicaciones.
- Consultar la disponibilidad de los profesionales.
- Solicitar horarios disponibles.
- Contactar al profesional mediante WhatsApp.
- Evaluar al profesional.
- Realizar reclamos.

## Profesional

El profesional podrá:

- Publicar servicios.
- Subir fotografías de sus servicios.
- Seleccionar oficio y comuna.
- Administrar sus bloques de disponibilidad.
- Aceptar o rechazar solicitudes.
- Contactar clientes mediante WhatsApp.
- Evaluar clientes.
- Recibir reclamos.

---

# Diseño del proyecto

## 1. Mockups

### Inicio

<img width="702" height="704" alt="image" src="https://github.com/user-attachments/assets/f4e42996-071f-464b-aef0-444a00d063eb" />

### Registro

<img width="724" height="450" alt="image" src="https://github.com/user-attachments/assets/47bba0a9-a721-4253-a093-0db4f400d6a9" />

### Inicio de sesión

<img width="722" height="446" alt="image" src="https://github.com/user-attachments/assets/05df0447-37c4-420b-bacf-3dff88fb40c0" />

### Crear publicación

<img width="720" height="450" alt="image" src="https://github.com/user-attachments/assets/412eaba7-946b-429f-bedb-9e0e838be4ba" />

### Galería de servicios

<img width="718" height="446" alt="image" src="https://github.com/user-attachments/assets/7fbc964b-23c6-409c-884b-d41c3d30ad4d" />

### Detalle del servicio

<img width="716" height="446" alt="image" src="https://github.com/user-attachments/assets/2fa24971-0c01-4b05-a238-bbf9f802c0fd" />

### Perfil de usuario

<img width="723" height="451" alt="image" src="https://github.com/user-attachments/assets/e5927290-c15f-4ab3-a19d-071e482b0048" />





---

## 2. Definición de la navegación entre las vistas

La aplicación ConectaPo se divide en vistas públicas y privadas.

Las vistas públicas pueden ser accedidas sin iniciar sesión e incluyen la
página principal, el registro, el inicio de sesión, la galería de
publicaciones y el detalle de una publicación.

Las vistas privadas requieren que el usuario haya iniciado sesión. Estas
incluyen funcionalidades como el perfil, la creación y gestión de
publicaciones, la disponibilidad y las solicitudes de reserva.

El sistema contempla dos roles principales: Cliente y Profesional. La
navegación y las funcionalidades disponibles dependerán del rol del usuario.

Para controlar el acceso a las vistas privadas, el frontend almacenará los
datos necesarios de la sesión del usuario, incluyendo su identificador,
información básica, rol y token de autenticación.

Cuando un usuario no autenticado intente acceder a una vista privada, será
Redirigido al inicio de sesión.

### Diagrama de navegación

<img width="481" height="804" alt="image" src="https://github.com/user-attachments/assets/000dc09b-5c8e-4ea6-a055-952790bd31e5" />


## 3. Dependencias y tecnologías

| Área | Tecnología |
|---|---|
| Frontend | React |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL |
| Autenticación | JWT |
| Contraseñas | bcrypt |
| Imágenes | Cloudinary + Multer |
| Contacto | WhatsApp Deep Link + EMail |


## 4. Diagrama Entidad-Relación

<img width="2938" height="2061" alt="ConectaPo_BD_09 08 2026" src="https://github.com/user-attachments/assets/2262321d-55fc-48f0-809a-6f499209db80" />


---

## 5. Contrato de la API REST

Bienvenido a la documentación oficial de la API de Conectapo. Esta API está estructurada bajo una arquitectura por esquemas (`auth`, `negocio`, `soporte`) para separar responsabilidades y asegurar la integridad de los datos.

---

## 1. Módulo de Autenticación (`/api/auth`)
Gestiona el acceso de los usuarios a la plataforma.

### Registro de Usuario
Permite a un nuevo cliente o profesional crear su cuenta en la plataforma. Por defecto, requiere definir la comuna para optimizar las búsquedas locales.

- **URL:** `/api/auth/registro`
- **Método:** `POST`
- **Body (JSON):**
  ```json
  {
    "rut": "11222333-4",
    "telefono": "+56912345678",
    "email": "juan.gasfiter@email.com",
    "password": "Password123!",
    "rol": "PROFESIONAL", // Puede ser 'CLIENTE' o 'PROFESIONAL'
    "comuna_id": 15 // ID de la comuna donde reside u opera por defecto
  }

```

* **Respuesta Exitosa (201 Created):**
```json
{
  "mensaje": "Usuario registrado con éxito.",
  "token": "eyJhbGciOiJIUzI1NiIsIn...", // JWT para futuras peticiones
  "usuario": {
    "id": "uuid-1234",
    "rol": "PROFESIONAL"
  }
}

```

### Iniciar Sesión

Valida las credenciales y devuelve el token de acceso (JWT) para interactuar con las rutas protegidas.

* **URL:** `/api/auth/login`
* **Método:** `POST`
* **Body (JSON):**
```json
{
  "email": "juan.gasfiter@email.com",
  "password": "Password123!"
}

```


* **Respuesta Exitosa (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "usuario": {
    "id": "uuid-1234",
    "email": "juan.gasfiter@email.com",
    "rol": "PROFESIONAL",
    "avatar_url": null
  }
}

```

---

## 2. Módulo de Negocios y Oficios (`/api/publicaciones`)

Maneja el directorio de servicios, precios en pesos chilenos (CLP) y el contador de popularidad.

### Listar Publicaciones (Buscador)

Endpoint público para buscar oficios. Permite filtrar dinámicamente por parámetros en la URL (Query Params) para encontrar la pega exacta en el sector indicado.

* **URL:** `/api/publicaciones`
* **Método:** `GET`
* **Query Params (Opcionales):**
* `?comuna_id=15` (Filtra por comuna)
* `?oficio_id=3` (Filtra por tipo de oficio, ej: Gásfiter)


* **Respuesta Exitosa (200 OK):**
```json
[
  {
    "id": "uuid-9876",
    "titulo": "Instalación de Calefont SEC",
    "oficio": "Gásfiter",
    "precio_base": 25000, // Siempre representado en CLP como número entero
    "es_horario_conversable": false, // Si es true, oculta el calendario en el frontend
    "evaluacion_promedio": 2.8, // Escala del 1 (Rojo) al 3 (Verde)
    "foto_url_1": "[https://cloudinary.com/](https://cloudinary.com/)..."
  }
]

```

### Crear Publicación

Endpoint protegido. Permite a un 'PROFESIONAL' publicar un nuevo servicio.

* **URL:** `/api/publicaciones`
* **Método:** `POST`
* **Headers:** `Authorization: Bearer <token>`
* **Body (JSON):**
```json
{
  "oficio_id": 3,
  "comuna_id": 15,
  "titulo": "Instalación de Calefont SEC",
  "descripcion": "Instalación y mantención garantizada en todo el sector oriente.",
  "precio_base": 25000,
  "es_horario_conversable": false,
  "foto_url_1": "[https://cloudinary.com/foto1.jpg](https://cloudinary.com/foto1.jpg)"
}

```


* **Respuesta Exitosa (201 Created):**
```json
{
  "mensaje": "Publicación creada exitosamente.",
  "publicacion_id": "uuid-9876"
}

```

### Registrar Vista (Estadísticas)

Endpoint público y ligero. Se ejecuta en segundo plano cuando un cliente entra a un perfil, sumando +1 al contador de vistas para métricas comerciales.

* **URL:** `/api/publicaciones/:id/vistas`
* **Método:** `PATCH`
* **Respuesta Exitosa (200 OK):**
```json
{
  "mensaje": "Vista registrada.",
  "contador_vistas": 142
}

```



---

## 3. Módulo de Calendario (`/api/bloques-horarios`)

El corazón transaccional de Conectapo. Administra la disponibilidad y aplica la "Regla de 1 Hora" para evitar agendamientos estancados.

### Generar Bloques Masivos

Permite al profesional crear de una sola vez su agenda semanal (ej: de 8:00 a 17:00 hrs) sin tener que ingresar los bloques uno por uno.

* **URL:** `/api/bloques-horarios/bulk`
* **Método:** `POST`
* **Headers:** `Authorization: Bearer <token>`
* **Body (JSON):**
```json
{
  "publicacion_id": "uuid-9876",
  "fecha_inicio": "2026-08-15",
  "fecha_fin": "2026-08-19",
  "hora_inicio": "08:00",
  "hora_fin": "17:00"
}

```

* **Respuesta Exitosa (201 Created):**
```json
{
  "mensaje": "45 bloques generados exitosamente."
}

```



### Cambiar Estado de Bloque (Reserva)

Se dispara cuando un cliente pincha un horario. Cambia el estado a 'PENDIENTE' y marca el timestamp de la solicitud. Si el profesional no confirma en 60 minutos, el cron-job del backend lo devuelve a 'DISPONIBLE'.

* **URL:** `/api/bloques-horarios/:id/estado`
* **Método:** `PATCH`
* **Headers:** `Authorization: Bearer <token>`
* **Body (JSON):**
```json
{
  "estado": "PENDIENTE" // Estados permitidos: DISPONIBLE, PENDIENTE, OCUPADO
}

```


* **Respuesta Exitosa (200 OK):**
```json
{
  "mensaje": "Estado del bloque actualizado.",
  "bloque": {
    "id": "uuid-5555",
    "estado": "PENDIENTE",
    "timestamp_solicitud": "2026-08-10T15:30:00Z"
  }
}

```

---

## 4. Módulo de Soporte (`/api/tickets`)

Canal de comunicación directa entre los usuarios (clientes/profesionales) y la administración de la plataforma.

### Generar Ticket

Crea una solicitud de ayuda (Reclamo, Sugerencia, Solicitar nuevo oficio, etc.).

* **URL:** `/api/tickets`
* **Método:** `POST`
* **Headers:** `Authorization: Bearer <token>`
* **Body (JSON):**
```json
{
  "tipo_ticket_id": 2, // ID referencial de la tabla maestra Tipos_Ticket
  "mensaje": "Hola equipo, quisiera sugerir que agreguen el oficio de 'Cerrajero' para mi comuna."
}

```


* **Respuesta Exitosa (201 Created):**
```json
{
  "mensaje": "Ticket recibido. Nuestro equipo lo revisará pronto.",
  "ticket_id": "uuid-7777",
  "estado": "ENVIADO" // Ciclo de vida: ENVIADO -> ENTREGADO -> RESUELTO
}


---

=======
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
>>>>>>> def0101cc7b26114ad2c821b8cba73ed31d348c3
