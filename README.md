# Evaluación 360 - Backend

Este es el backend del sistema de Evaluación 360, desarrollado con Node.js, Express y MongoDB. Proporciona autenticación, gestión de empleados, evaluaciones y feedback.

## 📌 Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [MongoDB](https://www.mongodb.com/) (en ejecución localmente o en la nube) con las bases de datos users y evaluations creadas
- [Yarn](https://yarnpkg.com/) (opcional, pero recomendado)

## ⚙ Configuración

1. Clona el repositorio:

   ```sh
   git clone https://github.com/jpirela/backend-evaluacion-360.git
   cd backend
   ```

2. Instala las dependencias:

   ```sh
   yarn install
   ```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017
   PORT=3030
   SECRET_KEY="supersecretkey"
   ```

4. Inicia el servidor (producción):

   ```sh
   yarn start
   ```

4. Inicia el servidor (depuración):

   ```sh
   yarn dev
   ```   

   El servidor estará disponible en `http://localhost:3030`.

## 📂 Estructura del Proyecto

```
C:.
│   .env
│   .gitignore
│   package.json
│   README.md
│   server.js
│   yarn.lock
│
├───api
│   ├───controllers
│   │       apiController.js
│   │
│   ├───models
│   │       Employee.js
│   │       Evaluation.js
│   │       Feedback.js
│   │
│   └───routes
│           apiRoutes.js
│
├───auth
│   ├───controllers
│   │       authController.js
│   │
│   ├───models
│   │       User.js
│   │       UserLog.js
│   │       
│   └───routes
│           authRoutes.js
│
├───config
│       database.js
│
├───middleware
│       auth.js
│       authorize.js
│
└───tests
        apiRoutes.test.js
        setup.js
```

## 🛠 Decisiones de Diseño

- **Modularidad**: La aplicación está estructurada en módulos (`auth`, `api`, `middleware`, etc.) para mejorar la mantenibilidad.
- **Middleware de Autenticación y Autorización**: Se utilizan `auth.js` y `authorize.js` para validar usuarios y permisos.
- **Base de Datos**: MongoDB se usa con Mongoose para modelar y gestionar datos.
- **Pruebas Automatizadas**: Se implementaron pruebas con `Jest` y `Supertest` para validar la API.

## ✅ Ejecutar Pruebas

Para ejecutar las pruebas unitarias y de integración:

1. Asegúrate de tener MongoDB en ejecución en `127.0.0.1:27017`.
2. En MongoDB crea la base de datos test_db
3. Ejecuta las pruebas con:

   ```sh
   yarn test
   ```

## 🚀 Endpoints Principales

### 📌 Autenticación

- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/profile` - Obtener perfil de usuario

### 📌 Empleados

- `GET /api/employees` - Obtener todos los empleados (Admin/Manager)
- `GET /api/employees/:id` - Obtener detalles de un empleado

### 📌 Evaluaciones

- `POST /api/evaluations` - Crear una evaluación (Admin/Manager)
- `GET /api/evaluations/:id` - Obtener evaluación por ID
- `GET /api/evaluations/employee/:id` - Evaluaciones de un empleado

### 📌 Feedback

- `POST /api/feedback` - Enviar feedback
- `GET /api/feedback/evaluation/:id` - Obtener feedback de una evaluación

## 🎯 Contribución

Si deseas contribuir:

1. Haz un fork del repositorio.
2. Crea una rama para tu nueva funcionalidad: `git checkout -b feature-nueva`.
3. Haz commit de tus cambios: `git commit -m 'Agrega nueva funcionalidad'`.
4. Envía un pull request.

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

👨‍💻 _Desarrollado por Jorge Pirela_

