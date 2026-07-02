# API REST con Express, Prisma, Zod, JWT y Bcrypt
# Docente: Lic. Roberto Antonio García Machado

Documentación paso a paso del proceso de construcción de una API REST para la gestión de estudiantes ("academy"), usando **Node.js**, **Express 5**, **Prisma ORM** (PostgreSQL), **Zod**, **bcryptjs** y **JSON Web Tokens (JWT)**.

## Tabla de contenidos

1. [Inicialización del proyecto](#1-inicialización-del-proyecto)
2. [Servidor con Express](#2-servidor-con-express)
3. [Nodemon para desarrollo](#3-nodemon-para-desarrollo)
4. [Variables de entorno](#4-variables-de-entorno)
5. [Organización en rutas (routers)](#5-organización-en-rutas-routers)
6. [Middleware de seguridad: API Key](#6-middleware-de-seguridad-api-key)
7. [Prisma + PostgreSQL](#7-prisma--postgresql)
8. [Modelos en schema.prisma](#8-modelos-en-schemaprisma)
9. [Conexión de Prisma con el adaptador pg](#9-conexión-de-prisma-con-el-adaptador-pg)
10. [Endpoint Create (POST)](#10-endpoint-create-post)
11. [Pruebas con HTTPie](#11-pruebas-con-httpie)
12. [Endpoints GET, UPDATE y DELETE](#12-endpoints-get-update-y-delete)
13. [Validación de datos con Zod](#13-validación-de-datos-con-zod)
14. [Encriptación de contraseñas con bcrypt](#14-encriptación-de-contraseñas-con-bcrypt)
15. [Autenticación con JWT](#15-autenticación-con-jwt)
16. [Middleware de autenticación (proteger rutas)](#16-middleware-de-autenticación-proteger-rutas)
17. [Notas finales](#17-notas-finales)

---

## 1. Inicialización del proyecto

1. Crear una carpeta para iniciar el proyecto de la API.
2. Inicializar el proyecto con **pnpm**:
   ```bash
   pnpm init
   ```
3. Crear una carpeta `src` donde se guardarán todos los archivos del proyecto.
4. Crear el archivo `index.js` dentro de `src`.
5. Ejecutar el archivo para probar que funciona:
   ```bash
   node .\src\index.js
   ```

## 2. Servidor con Express

1. Instalar Express para levantar el servidor:
   ```bash
   pnpm add express
   ```
   > Referencia: https://expressjs.com/en/5x/starter/installing/
2. **Dato curioso:** si se instala un paquete por error, se puede remover con:
   ```bash
   pnpm remove <paquete>
   ```
3. Correr la API:
   ```bash
   node .\src\index.js
   ```
4. En `package.json`, dentro de la sección `scripts`, agregar:
   ```json
   "dev": "node src/index.js"
   ```
   A partir de aquí, se puede iniciar el servidor con:
   ```bash
   pnpm dev
   ```

## 3. Nodemon para desarrollo

Para que el servidor se reinicie automáticamente con cada cambio (sin detenerlo y ejecutarlo manualmente):

1. Instalar `nodemon` como dependencia de desarrollo:
   ```bash
   pnpm add -D nodemon
   ```
   > Referencia: https://nodemon.io/
   - Instalación global (opcional): `pnpm install -g nodemon`
2. Crear un archivo `nodemon.json` **fuera** de la carpeta `src`, con el siguiente contenido:
   ```json
   {
     "watch": ["src"],
     "ext": "js",
     "ignore": ["node_modules"],
     "exec": "node src/index.js"
   }
   ```
3. Si algo falla, eliminar la carpeta `node_modules` y reinstalar todas las dependencias:
   ```bash
   pnpm install
   ```

## 4. Variables de entorno

1. Crear un archivo `.env` que funcionará como variable global del proyecto.
2. Instalar la librería `dotenv`:
   ```bash
   pnpm add dotenv
   ```
3. En `index.js`, importar la configuración al inicio del archivo:
   ```js
   import 'dotenv/config';
   ```
4. Para acceder a una variable de entorno (por ejemplo, el puerto):
   ```js
   const PORT = process.env.PORT;
   ```

## 5. Organización en rutas (routers)

1. Dentro de `src`, crear una carpeta `routes` (capa de rutas).
2. Dentro de `routes`, crear el archivo `users.routes.js`.
3. Mover (cortar) todos los endpoints CRUD desde `index.js` hacia `users.routes.js`, y exportar el router al final:
   ```js
   export default userRouter;
   ```
4. En `index.js`, importar el router al inicio del archivo:
   ```js
   import userRouter from './routes/users.routes.js';
   ```
5. Registrar el router en la aplicación:
   ```js
   app.use('/', userRouter);
   ```

## 6. Middleware de seguridad: API Key

Se implementa un middleware de autenticación previo a los endpoints, basado en un header personalizado.

1. Crear una carpeta `middleware` dentro de `src`.
2. Crear el archivo `apikey.middleware.js`.
3. El cliente debe enviar un header (`x-api-key`) para que el endpoint sea considerado seguro.
4. Definir el middleware:
   ```js
   const apikeymiddleware = (req, res, next) => {
     const apikey = req.headers['x-api-key'];

     if (!apikey || apikey !== 'sk_live_gx9WCOcbRq8emvQPCVCHj2hVcFTAWsfk') {
       return res.status(401).json({ message: 'API key is missing or invalid' });
     }
     next();
   };
   ```
5. En `index.js`, importar y usar el middleware **después** de `express.json()`:
   ```js
   import { apikeymiddleware } from './middleware/apikey.middleware.js';

   // MIDDLEWARES
   app.use(apikeymiddleware);
   ```

   > ⚠️ **Recomendación:** en un proyecto real, la API key no debe estar escrita directamente en el código; debe guardarse en el archivo `.env`.

## 7. Prisma + PostgreSQL

Configuración de **Prisma ORM** para consultar la base de datos en PostgreSQL.

1. Instalar Prisma como dependencia de desarrollo:
   ```bash
   pnpm add -D prisma
   ```
2. Descargar las dependencias necesarias (aprobar builds):
   ```bash
   pnpm approve-builds
   ```
   Seleccionar la opción `a` (all) y presionar Enter.
3. Instalar el cliente de Prisma:
   ```bash
   pnpm add @prisma/client
   ```
4. Inicializar Prisma con el proveedor PostgreSQL:
   ```bash
   pnpm exec prisma init --datasource-provider postgresql
   ```
5. Configurar el archivo `.env` con la cadena de conexión a la base de datos.
6. Crear el archivo `prisma.config.ts`.
7. Crear una carpeta `prisma` con el archivo `schema.prisma` dentro.
8. En el archivo `.env` se define la ruta/URL de conexión a la base de datos.

## 8. Modelos en schema.prisma

1. En `package.json`, agregar los siguientes scripts para trabajar con la base de datos:
   ```json
   "db:generate": "prisma generate",
   "db:migrate": "prisma migrate dev",
   "db:studio": "prisma studio"
   ```
2. Instalar la extensión de Prisma en el editor (VS Code).
3. Definir las tablas (modelos) en `schema.prisma`. Ejemplo del modelo `student`:
   ```prisma
   model student {
     id        Int      @id @default(autoincrement())
     nie       String   @unique
     firstname String
     lastname  String
     email     String   @unique
     password  String
     phone     String?  // dato opcional (signo de interrogación)
     bithdate  DateTime?
     active    Boolean  @default(true)
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```
   Se pueden crear más modelos siguiendo la misma sintaxis.
4. Crear la base de datos en pgAdmin con el nombre `academy`.
5. Configurar la conexión en el archivo `.env`:
   ```
   DATABASE_URL="postgresql://postgres:123456@localhost:5432/academy?schema=public"
   ```
6. Ejecutar la migración desde la terminal (asignar un nombre al commit cuando se solicite):
   ```bash
   pnpm db:migrate
   ```
7. Generar el cliente de Prisma para poder usar los modelos (tablas) en el proyecto:
   ```bash
   pnpm db:generate
   ```
   > Si se crea un nuevo modelo, se deben repetir los pasos 6 y 7.

## 9. Conexión de Prisma con el adaptador pg

1. Instalar el adaptador de PostgreSQL:
   ```bash
   pnpm add pg @prisma/adapter-pg
   ```
2. Dentro de `src`, crear una carpeta `lib` y, dentro de ella, el archivo `prisma.js`:
   ```js
   import { PrismaClient } from '@prisma/client';
   import { PrismaPg } from '@prisma/adapter-pg';

   const adapter = new PrismaPg(process.env.DATABASE_URL);
   const prisma = new PrismaClient({ adapter });

   export default prisma;
   ```
3. En `users.routes.js`, importar la instancia de Prisma:
   ```js
   import prisma from '../lib/prisma.js';
   ```
4. Abrir el IDE visual de la base de datos con:
   ```bash
   pnpm db:studio
   ```

## 10. Endpoint Create (POST)

1. En `users.routes.js`, crear el endpoint `/create` como función `async`.
2. Corrección de un error común de configuración:
   - En `schema.prisma`, quitar el `output` y, en el `generator`, dejar el provider como:
     ```prisma
     provider = "prisma-client-js"
     ```
   - Regenerar el cliente:
     ```bash
     pnpm db:generate
     ```
   - Levantar el servidor nuevamente:
     ```bash
     pnpm dev
     ```
3. Implementar la lógica de creación dentro de un bloque `try/catch`:
   ```js
   try {
     const newStudent = await prisma.student.create({
       data: {
         nie: nie,
         firstname: firstname,
         lastname: lastname,
         email: email,
         password: password,
         phone: phone,
         bithdate: birthdate ? new Date(birthdate) : null
       }
     });

     res.status(201).json({
       success: true,
       mensaje: 'Nuevo Alumno registrado exitosamente',
       data: newStudent
     });
   } catch (error) {
     // manejo de errores
   }
   ```
   > ⚠️ Tener cuidado con los nombres de los campos definidos en `schema.prisma` (por ejemplo, `bithdate`) y con las variables recibidas desde el body del formulario.

## 11. Pruebas con HTTPie

1. Probar el endpoint en HTTPie, agregando en **Headers** el header `x-api-key` con el valor `{{APIKEY}}`.
2. Probar tanto peticiones `POST` como `GET` de la API.

## 12. Endpoints GET, UPDATE y DELETE

1. Implementar el endpoint `GET` para obtener todos los registros de la tabla.
2. Implementar el endpoint `UPDATE` (edición de registros) en `users.routes.js`.
3. Implementar el endpoint `DELETE` para eliminar registros y probarlo con HTTPie.

## 13. Validación de datos con Zod

1. Instalar la librería de validación:
   ```bash
   pnpm add zod
   ```
2. Importarla en el archivo correspondiente:
   ```js
   import { z } from 'zod';
   ```
3. Definir el esquema de validación, por ejemplo:
   ```js
   const studentSchema = z.object({
     nie: z.string()
       .min(5, { message: "El NIE debe tener al menos 5 caracteres" })
       .max(10, { message: "El NIE no puede tener más de 10 caracteres" }),
     // ...otros campos del modelo
   });
   ```
4. Usar un middleware/constante de validación (`validate`) antes de la lógica del endpoint.

## 14. Encriptación de contraseñas con bcrypt

1. Instalar la librería:
   ```bash
   pnpm add bcryptjs
   ```
2. Importarla al inicio del archivo:
   ```js
   import bcrypt from 'bcryptjs';
   ```
3. En el endpoint `create`, generar una contraseña encriptada (`hashedPassword`) y sustituir la variable `password` original por esta al guardar el registro.

## 15. Autenticación con JWT

**JWT (JSON Web Token)** es un estándar para el manejo de autenticaciones y sesiones de usuario. Más información: https://www.jwt.io/

> ⚠️ Se debe cuidar especialmente la firma del token (sección *JWT Encoder*) y su tiempo de duración.

1. Instalar la librería:
   ```bash
   pnpm add jsonwebtoken
   ```
2. Crear el archivo `auth.routes.js` dentro de la carpeta `routes`.
3. Definir el router de autenticación:
   ```js
   import { Router } from 'express';
   const authRouter = Router();

   authRouter.post('/login', async (req, res) => {
     res.status(200).json({ message: "Funciona" });
   });

   export default authRouter;
   ```
4. En `index.js`, importar el router:
   ```js
   import authRouter from './routes/auth.routes.js';
   ```
5. Registrar la ruta:
   ```js
   app.use('/auth', authRouter);
   ```
6. Probar en HTTPie:
   ```
   POST localhost:8000/auth/login
   ```
   agregando las credenciales `x-api-key` y `{{APIKEY}}`.
7. Validar los datos de entrada con Zod:
   ```js
   import { z } from 'zod';

   const loginSchema = z.object({
     email: z.string().email({ message: "El correo electrónico no es válido" }),
     password: z.string()
       .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
       .max(24, { message: "La contraseña no puede tener más de 24 caracteres" }),
   });
   ```
8. Completar la lógica del endpoint `/login` (verificación de credenciales y generación del token).
9. Agregar en el archivo `.env` una clave secreta para la autenticación:
   ```
   JWT_SECRET = 'ezKYRJZ/g3Z+iy+E35lVxwVFeqUtyK5r0dzVMy3Pf7s='
   ```
   > La clave se puede generar en: https://randomkeygen.com/
10. Probar el login en HTTPie con un body como el siguiente:
    ```json
    {
      "email": "mariefer@gmail.com",
      "password": "12345678"
    }
    ```
    ```
    POST localhost:8000/auth/login
    ```

## 16. Middleware de autenticación (proteger rutas)

1. Crear el archivo `auth.middleware.js` dentro de la carpeta `middleware`, para proteger los endpoints mediante un token de acceso:
   ```js
   // Proteger mis rutas con un middleware que verifique el token
   export const authMiddleware = (req, res, next) => {
     const authHeader = req.headers['authorization'];

     if (!authHeader?.startsWith('Bearer ')) {
       return res.status(401).json({ success: false, mensaje: 'Acceso no autorizado' });
     }

     const token = authHeader.split(' ')[1]; // Eliminar 'Bearer ' del inicio

     // Aquí iría la lógica para verificar el token
     next();
   };
   ```
2. Completar la lógica de verificación del token dentro de este middleware, para evitar el acceso sin un token válido.
3. En `users.routes.js`, importar el middleware:
   ```js
   import { authMiddleware } from '../middleware/auth.middleware.js';
   ```
4. Aplicarlo en el endpoint `create`, junto con la validación de Zod:
   ```js
   userRouter.post("/create", authMiddleware, validate(studentSchema), async (req, res) => {
     // ...
   });
   ```
5. Probar el flujo completo en HTTPie:
   - Generar un nuevo token con `POST localhost:8000/auth/login`.
   - Copiar el token recibido (sin comillas).
   - En el endpoint `create`, agregar el token en el header `Authorization` como `Bearer <token>`.
   - Ejecutar `POST localhost:8000/create`, incluyendo:
     - Datos del `body`.
     - Header `x-api-key`.
     - Header `Authorization` (`Bearer <token>`).

## 17. Notas finales

- El proyecto utiliza dos capas de seguridad combinadas: **API Key** (a nivel global) y **JWT** (a nivel de endpoints protegidos específicos).
- Los secretos sensibles (`API key`, `JWT_SECRET`, credenciales de base de datos) deben mantenerse siempre en el archivo `.env` y nunca subirse a un repositorio público.
- Flujo recomendado al agregar un nuevo modelo en `schema.prisma`:
  1. Editar `schema.prisma`.
  2. `pnpm db:migrate`
  3. `pnpm db:generate`
