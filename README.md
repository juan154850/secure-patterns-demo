# Secure Patterns Demo

Este es un proyecto educativo que busca demostrar **vulnerabilidades de seguridad comunes** en aplicaciones web con ejemplos prácticos de código **inseguro** y **seguro**.

## Propósito

Proporcionar ejemplos prácticos de vulnerabilidades de seguridad web para fines educativos, mostrando tanto implementaciones vulnerables como sus contrapartes seguras.

## Tabla de Contenidos

- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
- [Vulnerabilidades Implementadas](#vulnerabilidades-implementadas)
- [Uso de la API](#uso-de-la-api)
- [Ejecutar Tests](#ejecutar-tests)
- [Linting y Calidad de Código](#linting-y-calidad-de-código)
- [Estructura de Archivos](#estructura-de-archivos)
- [Patrones de Seguridad](#patrones-de-seguridad)

## Tecnologías Utilizadas

### Backend
- **Node.js** con **Express 5.x** - Framework web
- **MySQL** con **Sequelize ORM** - Base de datos
- **JWT (jsonwebtoken)** - Autenticación
- **bcrypt** - Hash de contraseñas
- **Zod** - Validación de esquemas
- **Helmet** - Headers de seguridad
- **express-rate-limit** - Limitación de requests

### Testing y Calidad
- **Jest** - Framework de testing
- **Supertest** - Testing de APIs
- **ESLint** con **eslint-plugin-security** - Linting y análisis de seguridad

### DevOps
- **Docker Compose** - Orquestación de servicios
- **dotenv** - Gestión de variables de entorno

## Estructura del Proyecto

```
secure-patterns-demo/
├── src/
│   ├── app.js                 # Configuración principal de Express
│   ├── index.js               # Punto de entrada de la aplicación
│   ├── config/
│   │   └── database.js        # Configuración de Sequelize
│   ├── models/
│   │   ├── index.js           # Modelos centralizados y asociaciones
│   │   ├── user.js            # Modelo de Usuario
│   │   └── document.js        # Modelo de Documento
│   ├── database/
│   │   └── init-db.js         # Inicialización de base de datos
│   ├── controllers/
│   │   ├── examples/
│   │   │   ├── insecure/      # Controladores vulnerables
│   │   │   │   ├── broken-auth.controller.js
│   │   │   │   ├── broken-access-control.controller.js
│   │   │   │   ├── csrf.controller.js
│   │   │   │   ├── sql-injection.controller.js
│   │   │   │   └── xss.controller.js
│   │   │   └── secure/        # Controladores seguros
│   │   │       ├── broken-auth.controller.js
│   │   │       ├── broken-access-control.controller.js
│   │   │       ├── csrf.controller.js
│   │   │       ├── sql-injection.controller.js
│   │   │       └── xss.controller.js
│   ├── middlewares/
│   │   ├── auth-rate-limit.middleware.js
│   │   ├── auth-validation.middleware.js
│   │   ├── csrf-protection.middleware.js
│   │   ├── document-validation.middleware.js
│   │   └── validate-query.middleware.js
│   └── routes/
│       ├── broken-auth.js
│       ├── broken-access-control.js
│       ├── csrf.js
│       ├── ping.js
│       ├── sql-injection.js
│       └── xss.js
├── tests/
│   ├── broken-auth.test.js
│   ├── broken-access-control.test.js
│   ├── csrf.test.js
│   ├── sql-injection.test.js
│   └── xss.test.js
├── docker-compose.yml
├── package.json
├── eslint.config.js
└── .env
```

## Instalación y Configuración

### 1. Prerrequisitos
- Node.js 18+ 
- Docker y Docker Compose
- MySQL 8.x

### 2. Clonar el repositorio
```bash
git clone https://github.com/juan154850/secure-patterns-demo
cd secure-patterns-demo
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Configurar variables de entorno
Crear archivo `.env`:
```env
DB_HOST=localhost
DB_PORT=3308
DB_USER=app
DB_PASSWORD=secret
DB_NAME=secure_demo
PORT=3000
```

### 5. Iniciar base de datos
```bash
docker-compose up -d
```

### 6. Ejecutar la aplicación
```bash
# Desarrollo (con watch)
npm run dev

# Producción
npm start
```

La API estará disponible en `http://localhost:3000`

## Vulnerabilidades Implementadas

### 1. **SQL Injection**
- **Ruta insegura**: `GET /sql/insecure?id=1 OR 1=1`
- **Ruta segura**: `GET /sql/secure?id=1`
- **Vulnerabilidad**: Concatenación directa de parámetros en consultas SQL
- **Protección**: Prepared statements con Sequelize

### 2. **Cross-Site Scripting (XSS)**
- **Ruta insegura**: `GET /xss/insecure?name=<script>alert('XSS')</script>`
- **Ruta segura**: `GET /xss/secure?name=<script>alert('XSS')</script>`
- **Vulnerabilidad**: Output sin sanitizar
- **Protección**: Escape HTML con `escape-html`

### 3. **Cross-Site Request Forgery (CSRF)**
- **Ruta insegura**: `POST /csrf/insecure`
- **Ruta segura**: `POST /csrf/secure` (requiere token)
- **Vulnerabilidad**: Falta de validación de origen
- **Protección**: Tokens CSRF con `csurf`

### 4. **Broken Authentication**
- **Rutas inseguras**: `/auth/register/insecure`, `/auth/login/insecure`
- **Rutas seguras**: `/auth/register/secure`, `/auth/login/secure`
- **Vulnerabilidades**:
  - Contraseñas en texto plano
  - JWT sin expiración
  - Secretos débiles hardcodeados
  - Falta de validación de contraseñas
- **Protecciones**:
  - Hash bcrypt con salt
  - JWT con expiración
  - Secretos desde variables de entorno
  - Validación de contraseñas fuertes
  - Rate limiting

### 5. **Broken Access Control (IDOR)**
- **Rutas inseguras**: `/access/documents/insecure/*`
- **Rutas seguras**: `/access/documents/secure/*`
- **Vulnerabilidades**:
  - Acceso directo a recursos por ID
  - Falta de validación de propietario
  - Listado de todos los recursos
- **Protecciones**:
  - Validación de propietario
  - Filtrado por usuario autenticado
  - Validación de JWT
  - Manejo de errores apropiado

## Uso de la API

### Ping
```bash
GET /ping
```

### SQL Injection
```bash
# Vulnerable
GET /sql/insecure?id=1 OR 1=1

# Seguro
GET /sql/secure?id=1
```

### XSS
```bash
# Vulnerable
GET /xss/insecure?name=<script>alert('XSS')</script>

# Seguro
GET /xss/secure?name=<script>alert('XSS')</script>
```

### CSRF
```bash
# Obtener token
GET /csrf/secure/token

# Vulnerable
POST /csrf/insecure
Content-Type: application/json
{"email": "attacker@example.com"}

# Seguro
POST /csrf/secure
Content-Type: application/json
Cookie: _csrf=<token>
{"_csrf": "<token>", "email": "secure@example.com"}
```

### Broken Authentication
```bash
# Registro inseguro
POST /auth/register/insecure
{"username": "test", "password": "123", "email": "test@example.com"}

# Registro seguro
POST /auth/register/secure
{"username": "test", "password": "SecurePass123", "email": "test@example.com"}

# Login
POST /auth/login/insecure
{"username": "test", "password": "123"}

# Perfil
GET /auth/profile/secure
Authorization: Bearer <jwt-token>
```

### Broken Access Control
```bash
# Listar documentos
GET /access/documents/insecure
Authorization: Bearer <jwt-token>

# Obtener documento específico
GET /access/documents/secure/1
Authorization: Bearer <jwt-token>

# Crear documento
POST /access/documents/secure
Authorization: Bearer <jwt-token>
{"title": "Mi documento", "content": "Contenido privado"}

# Actualizar documento
PUT /access/documents/secure/1
Authorization: Bearer <jwt-token>
{"title": "Nuevo título", "content": "Nuevo contenido"}

# Eliminar documento
DELETE /access/documents/secure/1
Authorization: Bearer <jwt-token>
```

## Ejecutar Tests

### Todos los tests
```bash
npm test
```

### Tests específicos
```bash
npm test -- tests/broken-auth.test.js
npm test -- tests/broken-access-control.test.js
npm test -- tests/sql-injection.test.js
npm test -- tests/xss.test.js
npm test -- tests/csrf.test.js
```

### Cobertura de tests
Los tests cubren:
- Funcionalidad vulnerable (confirma que las vulnerabilidades existen)
- Funcionalidad segura (confirma que las protecciones funcionan)
- Casos edge y manejo de errores
- Validación de entrada
- Autenticación y autorización

## Linting y Calidad de Código

### Verificar código
```bash
npm run lint
```

### Corregir automáticamente
```bash
npm run lint:fix
```

### Análisis de seguridad
```bash
npm run lint:sec
```

### Configuración ESLint
- **Reglas base**: `@eslint/js/recommended`
- **Plugin de seguridad**: `eslint-plugin-security`
- **Estilo**: Indent 2 espacios, comillas simples, semicolons obligatorios

## Estructura de Archivos

### Modelos
- `user.js`: Modelo de usuario con campos de autenticación
- `document.js`: Modelo de documento para demostrar IDOR
- `index.js`: Gestión centralizada de asociaciones

### Controladores
Cada vulnerabilidad tiene controladores separados:
- `examples/insecure/`: Implementaciones vulnerables
- `examples/secure/`: Implementaciones seguras

### Middlewares
- `auth-rate-limit.middleware.js`: Limitación de requests
- `auth-validation.middleware.js`: Validación de esquemas de autenticación
- `csrf-protection.middleware.js`: Protección CSRF
- `document-validation.middleware.js`: Validación de documentos
- `validate-query.middleware.js`: Validación de query parameters

### Routes
Cada vulnerabilidad tiene rutas separadas con endpoints `/insecure` y `/secure`.

## Patrones de Seguridad

### Validación de Entrada
```javascript
const schema = z.object({
  password: z.string()
    .min(8, 'Password debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, 'Password debe contener mayúscula, minúscula y número')
});
```

### Hash de Contraseñas
```javascript
const hashedPassword = await bcrypt.hash(password, 12);
```

### JWT Seguro
```javascript
const token = jwt.sign(
  { userId: user.id, username: user.username },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);
```

### Prepared Statements
```javascript
const [rows] = await sequelize.query(
  'SELECT * FROM Users WHERE id = ?', 
  { replacements: [id] }
);
```

### Rate Limiting
```javascript
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos por IP
  message: { error: 'Demasiados intentos' }
});
```

## Advertencias

⚠️ **SOLO PARA FINES EDUCATIVOS**
- Este código contiene vulnerabilidades intencionalmente
- NO usar en producción
- NO exponer endpoints inseguros en entornos públicos
