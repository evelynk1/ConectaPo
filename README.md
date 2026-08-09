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

# Tecnologías

| Área | Tecnología |
|---|---|
| Frontend | React |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL |
| Autenticación | JWT |
| Contraseñas | bcrypt |
| Imágenes | Cloudinary + Multer |
| Contacto | WhatsApp Deep Link |

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

<img width="722" height="454" alt="image" src="https://github.com/user-attachments/assets/40c20a97-7235-45b6-8c14-4d44b3e0cab4" />



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
| Contacto | WhatsApp Deep Link |


## 4. Diagrama Entidad-Relación

[Aquí irá el DER]

---

## 5. Arquitectura del sistema

[Aquí irá el diagrama de arquitectura]

---

