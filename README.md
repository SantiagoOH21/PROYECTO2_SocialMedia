# 🌐 Proyecto SocialMedia - API RESTful

Este proyecto es una API para una red social, construida con **Node.js**, **Express**, **MongoDB**, y **Mongoose**. Esta API permite a los usuarios registrarse, iniciar sesión, crear publicaciones, dar likes, comentar y seguir a otros usuarios. Incluye autenticación con JWT, subida de imágenes, Swagger para documentación, y despliegue preparado.

---

## 🚀 Tabla de Contenidos

- [📦 Tecnologías](#-tecnologías)
- [⚙️ Instalación](#️-instalación)
- [🔐 Autenticación y Seguridad](#-autenticación-y-seguridad)
- [📡 Endpoints](#-endpoints)
- [🖼️ Subida de Imágenes](#️-subida-de-imágenes)
- [📄 Documentación de la API](#-documentación-de-la-api)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🐳 Contenedores Docker](#-contenedores-docker)
- [🚀 Despliegue en Render](#-despliegue-en-render)
- [🧑‍💻 Autor](#-autor)

---

## 📦 Tecnologías

- **Node.js**: Entorno de ejecución de JavaScript.
- **Express.js**: Framework web para Node.js, utilizado para construir la API REST.
- **MongoDB**: Base de datos NoSQL para el almacenamiento de datos.
- **Mongoose**: ODM (Object Data Modeling) para MongoDB en Node.js, que simplifica la interacción con la base de datos.
- **Bcrypt.js**: Librería para el hashing de contraseñas.
- **JSON Web Tokens (JWT)**: Para la autenticación basada en tokens.
- **Multer**: Middleware para manejar `multipart/form-data`, esencial para la subida de imágenes.
- **Dotenv**: Para la gestión de variables de entorno.
- **Swagger UI Express**: Para generar y servir la documentación de la API.
- **Postman**: Herramienta utilizada para probar y verificar los endpoints de la API.
- **Docker**: Plataforma para desarrollar, enviar y ejecutar aplicaciones en contenedores.
- **Docker Compose**: Herramienta para definir y ejecutar aplicaciones multi-contenedor Docker.
- **Nodemon** (solo en desarrollo): Herramienta para reiniciar el servidor automáticamente en cada cambio.

---

## ⚙️ Instalación

# 1. Clonar el repositorio

```bash
git clone https://github.com/SantiagoOH21/proyecto2_socialmedia.git

cd proyecto2_socialmedia
```

# 2. Instalar dependencias

```bash
npm install
```

# 3. Crear archivo .env

```bash
cp .env.example .env
```

# 4. Iniciar el servidor

```bash
npm start
```

## 🔐 Autenticación y Seguridad

- **Registro de usuarios:**
  Los usuarios pueden registrarse con una contraseña que se encripta usando `bcryptjs` para asegurar su seguridad.

- **Login:**
  Los usuarios inician sesión proporcionando sus credenciales. Si son correctas, se les genera un token JWT para autenticar futuras peticiones.

- **Middleware de autenticación:**
  Las rutas que requieren usuario autenticado usan un middleware `authentication` que valida el token JWT y autoriza el acceso.

- **Middleware de autorización:**
  Para acciones sensibles como editar o eliminar posts y comentarios, se usa un middleware `isAuthorOrAdmin` que verifica que el usuario sea el autor o tenga privilegios de administrador.

- **Logout:**
  Permite invalidar la sesión del usuario, eliminando su token o limpiando la sesión.

- **Validaciones:**
  Se implementan validaciones para asegurar que todos los campos obligatorios se rellenen correctamente tanto en el registro como en la creación/actualización de posts y comentarios.

- **Protección de rutas:**
  Solo usuarios autenticados pueden crear, modificar o eliminar recursos protegidos.

- **Seguridad adicional:**
  La subida de archivos (imágenes) se gestiona con `multer`, evitando la inyección de archivos maliciosos.

---

## 📡 Endpoints

### 👤 Usuarios (`/users`)

| Método   | Endpoint         | Descripción                                                                  | Autenticación | Archivos            | Validaciones                                            |
| :------- | :--------------- | :--------------------------------------------------------------------------- | :------------ | :------------------ | :------------------------------------------------------ |
| `POST`   | `/register`      | Registra un nuevo usuario con Bcrypt.                                        | No            | `avatar` (opcional) | Todos los campos son requeridos (excepto imagen).       |
| `POST`   | `/login`         | Inicia sesión, devuelve un token JWT.                                        | No            | No                  | Si el correo no está confirmado no permite la conexión. |
| `DELETE` | `/logout`        | Cierra la sesión del usuario.                                                | Sí            | No                  |                                                         |
| `GET`    | `/`              | Obtiene todos los usuarios.                                                  | No            | No                  |                                                         |
| `PUT`    | `/id/:id`        | Actualiza un usuario. **Requiere ser el autor o admin.**                     | Sí            | `avatar` (opcional) |                                                         |
| `DELETE` | `/id/:id`        | Elimina un usuario. **Requiere ser el autor o admin.**                       | Sí            | No                  |                                                         |
| `PUT`    | `/follow/:id`    | Permite seguir a otro usuario.                                               | Sí            | No                  |                                                         |
| `PUT`    | `/unfollow/:id`  | Permite dejar de seguir a otro usuario.                                      | Sí            | No                  |                                                         |
| `GET`    | `/followers/:id` | Obtiene los seguidores de un usuario.                                        | No            | No                  |                                                         |
| `GET`    | `/following/:id` | Obtiene los usuarios a los que sigue un usuario.                             | No            | No                  |                                                         |
| `GET`    | `/me`            | Obtiene la información del usuario autenticado (incluye posts y seguidores). | Sí            | No                  |                                                         |
| `GET`    | `/id/:id`        | Busca un usuario por ID.                                                     | No            | No                  |                                                         |
| `GET`    | `/name/:name`    | Busca usuarios por nombre.                                                   | No            | No                  |                                                         |

---

### 📝 Posts (`/posts`)

| Método   | Endpoint      | Descripción                                                                     | Autenticación | Archivos           | Validaciones                                      |
| :------- | :------------ | :------------------------------------------------------------------------------ | :------------ | :----------------- | :------------------------------------------------ |
| `POST`   | `/`           | Crea un nuevo post.                                                             | Sí            | `image` (opcional) | Todos los campos son requeridos (excepto imagen). |
| `GET`    | `/`           | Obtiene todos los posts (con usuario y comentarios), con paginación (10 en 10). | No            | No                 |                                                   |
| `GET`    | `/id/:id`     | Obtiene un post por su ID.                                                      | No            | No                 |                                                   |
| `GET`    | `/name/:name` | Busca posts por nombre.                                                         | No            | No                 |                                                   |
| `DELETE` | `/:id`        | Elimina un post. **Requiere ser el autor o admin.**                             | Sí            | `image` (opcional) |                                                   |
| `PUT`    | `/:id`        | Actualiza un post existente. **Requiere ser el autor.**                         | Sí            | No                 |                                                   |
| `PUT`    | `/likes/:id`  | Da "Like" a un post.                                                            | Sí            | No                 |                                                   |
| `PUT`    | `/unlike/:id` | Quita un "Like" de un post.                                                     | Sí            | No                 |                                                   |

---

### 💬 Comentarios (`/comments`)

| Método   | Endpoint       | Descripción                                         | Autenticación | Archivos           |
| :------- | :------------- | :-------------------------------------------------- | :------------ | :----------------- |
| `POST`   | `/`            | Crea un comentario en un post específico.           | Sí            | `image` (opcional) |
| `GET`    | `/`            | Obtiene todos los comentarios.                      | No            | No                 |
| `PUT`    | `/:id`         | Actualiza un comentario. **Requiere ser el autor.** | Sí            | `image` (opcional) |
| `DELETE` | `/:id`         | Elimina un comentario. **Requiere ser el autor.**   | Sí            | No                 |
| `PUT`    | `/likes/:_id`  | Da "Like" a un comentario.                          | Sí            | No                 |
| `PUT`    | `/unlike/:_id` | Quita un "Like" de un comentario.                   | Sí            | No                 |

---

## 🖼️ Subida de Imágenes

La API permite subir imágenes en:

- Registro/edición de usuarios → campo `avatar`
- Creación/edición de posts → campo `image`
- Creación/edición de comentarios → campo `image`

Las imágenes se almacenan en la carpeta local `/uploads`.

---

## 📄 Documentación de la API

La documentación está disponible en Swagger:

- Accede en: [`/api-docs`](http://localhost:3001/api-docs)

Configurada con `swagger-ui-express` para visualizar de forma gráfica todos los endpoints disponibles.

---

## 📁 Estructura del Proyecto

```

proyecto2_socialmedia/
│
├── src/
│ ├── config/               # Configuración de base de datos
│ ├── controllers/          # Lógica de negocio (User, Post, Comment)
│ ├── docs/                 # Documentación Swagger
│ ├── middlewares/          # Middlewares de autenticación, validación, subida de archivos
│ ├── models/               # Modelos de datos (Mongoose)
│ ├── routes/               # Endpoints de la API
│ └── index.js              # Archivo principal del servidor
│
├── uploads/                # Archivos subidos por los usuarios
├── .env                    # Variables de entorno (no incluido en Git)
├── .env.example            # Ejemplo de configuración de variables de entorno necesarias para el proyecto
├── .gitignore              # Archivos y carpetas que deben ser ignorados por Git
├── Dockerfile              # Instrucciones para construir la imagen Docker del servidor
├── docker-compose.yml      # Orquestación de servicios Docker (API, base de datos, etc.)
├── package-lock.json       # Registro exacto de versiones de dependencias instaladas
├── package.json            # Información del proyecto y listado de dependencias
└── README.md               # Documentación principal del proyecto (instalación, uso, etc.)

```

---

## 🐳 Contenedores Docker

Este proyecto está preparado para ejecutarse en contenedores Docker utilizando `Docker` y `Docker Compose`, lo cual facilita su despliegue y portabilidad.

### 🧱 Archivos relevantes

- `Dockerfile`: Define la imagen del servidor Node.js.
- `docker-compose.yml`: Orquesta la ejecución de la API junto a un contenedor MongoDB.

### ▶️ Cómo levantar el proyecto con Docker

```bash
# Construir los contenedores
docker compose build
```

```bash
# Levanta los contenedores en segundo plano
docker compose up
```

```bash
# Para detener los contenedores
docker compose down
```

> Asegúrate de tener Docker y Docker Compose instalados en tu sistema antes de ejecutar estos comandos.

## 🚀 Despliegue en Render

La API ha sido desplegada utilizando [Render](https://render.com/), una plataforma de hosting en la nube para aplicaciones web y APIs.

### 🌍 Enlace a producción

🔗 [https://proyecto2-socialmedia.onrender.com](https://proyecto2-socialmedia.onrender.com)

### 📌 Configuración usada en Render

- **Tipo de servicio:** Web Service
- **Entorno de ejecución:** Node.js
- **Comando de build:** `npm install`
- **Comando de inicio:** `npm start`
- **Variables de entorno:**
  - `MONGODB_URI`: URI de tu base de datos (por ejemplo, en MongoDB Atlas)
  - `JWT_SECRET`: Clave secreta para firmar los tokens JWT
  - `PORT`: Render lo gestiona automáticamente (no necesitas definirlo)

> Render proporciona automáticamente HTTPS, reinicio automático del servicio, despliegue continuo desde GitHub y monitoreo básico del estado del servidor.

## 🧑‍💻 Autor

- Santiago Orozco Hernández [@SantiagoOH21](https://github.com/SantiagoOH21)
