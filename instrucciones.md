1. crear una carpeta, para iniciar la api
2. pnpm init
3. crear una carpeta donde se guarde todo mis archivos "src"
4. crear el archivo index.js en "src"
5. correr el archivo: node .\src\index.js
6. levantar el servidor: pnpm add express --https://expressjs.com/en/5x/starter/installing/
7. dato curioso: si se instala un paquete erroneo: pnpm remove 
8. correr la api: node .\src\index.js
9. en el archivo package.json,  "dev": "node src/index.js" dentro de Script, aca se usa pnpm dev para invocar el mismo archivo, o equivalente al punto 8
10. Instalar la siguiente Dependecia para que automaticamente haga los cambios en el servidor, sin estar quitando y ejecutando el server. 
pnpm add -D nodemon //https://nodemon.io/ esa instalacion es en local pnpm install -g nodemon (global)
11. crear afuera de la carpeta src, un archivo nodemon.json y escribir:
{
    "watch": ["src"],
    "ext": "js",
    "ignore": ["node_modules"],
    "exec": "node src/index.js"
}
12. si falla algo, borrar la carpeta node_modules, entonces instalar todas las dependencias con el siguiente comando: 
pnpm install

//SIGUIENTE SESION
1. Variables de entorno, crear un archivo .dev que sera una variable global 
2. ejecutar el comando pnpm add dotenv
3. en index.js importar: import 'dotenv/config';
4. para ejecutar la variable de entorno: const PORT = process.env.PORT
5. Dentro de src, crear una carpeta de routes (capas)
6. dentro de routes, crear users.routes.js
7. Cortar todos los CRUD de index.js a users.routes.js y al final escribir export default userRouter;
8. Luego en index.js, escribir en la parte superior: import userRouter from './routes/users.routes.js';
9. Luego que todo lo anterior este disponible en: app.use('/', userRouter);
10. 

--NUEVA SESION
1. Seguridad en mis apis, MIDDLEWARES, autenticación antes de mi endpoint
2. crear una carpeta en src con el nombre middleware
3. crear un archivo js con el nombre apikey.middleware.js
4. hay que enviar un header para que mi endpoint sea mas seguro.
5. se crea una constante y es el siguiente codigo: 
    const apikeymiddleware = (req, res, next) => {
    const apikey = req.headers['x-api-key']; 
}
6. luego agregar el siguiente codigo: 
if (!apikey ||apikey !== 'sk_live_gx9WCOcbRq8emvQPCVCHj2hVcFTAWsfk'){
        return res.status(401).json({ message: 'API key is missing or invalid' });
    }
    next();
7. Luego en index.js, agregar el siguiente codigo despues de express.json()
//MIDDLEWARES
app.use(apikeymiddleware);
y en la parte superior hacer un import: import { apikeymiddleware } from './middleware/apikey.middleware.js';


//USAR PRISMA.IO PARA CONSULTAR BD EN POSTGRE
1. instalamos la dependencia: pnpm add -D prisma
2. luego descargamos sus dependencias necesarias: pnpm approve-builds, seleccionamos la letra a y luego enter.
3. instalar el menu de prisma, se instala: pnpm add @prisma/client
4. Luego usar este comando: pnpm exec prisma init --datasource-provider postgresql
5. configurar el archivo .env concerniente al acceso a la BD
6. creo un archivo prisma.config.ts
7. creo una carpeta prisma, dentro un archivo schema.prisma
8. en el archivo .env se creo la ruta de la base de datos

//viernes 19 de junio 2026
1. Luego en package.json en la parte de depurar, escribir el siguiente codigo:
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
    Esto es para configurar la base de datos y que funcione igual a .js
2. instalar la extension prisma.
3. Crear tablas en schema.prisma con su respectiva sintaxis en prisma:
    model student{
        id Int @id @default(autoincrement())
        nie String @unique
        firstname String
        lastname String
        email String @unique
        password String
        phone String? //dato opcional el signo interrogacion
        bithdate DateTime?
        active Boolean @default(true)
        createdAt DateTime @default(now())
        updatedAt DateTime @updatedAt
        }
    se crean mas tablas
4. Crear una bd en pgadmin, con el nombre academy
5. Crear la conexion en el archivo .env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/academy?schema=public"
6. usar el siguiente comando en terminal de vsc: pnpm db:migrate y luego nombre al commit
7. usar el siguiente comando en terminal: pnpm db:generate, para poder usar los modelos (tablas) en el proyecto.
si creo otro modelo de tabla debo usar el punto 6 y 7
8. Instalar el adaptador-pg:  pnpm add pg @prisma/adapter-pg
9. Dentro de src, crear una carpeta lib, luego un archivo prisma.js y escribir el siguiente codigo:
    import {PrimaClient} from '@prisma/client'
    import {PrismaPg} from '@prisma/adapter-pg'

    const adapter = new PrismaPg(process.env.DATABASE_URL)
    const prisma = new PrimaClient({adapter})

    export default prisma
10. ir al archivo users.routes.js y empezar a trabajar en /create, y agregar async
11. Luego escribir su codigo endpoint de insertar registro

12. abrir el ide de prisma studio con el comando: pnpm db:studio

//clase miercoles 24 de Junio de 2026
1. importar a prisma en user.routers.js con el siguiente comando: import prisma from '..lib/prisma.js'; 
2. Trabajar en el try catch, en el try se escribe el codigo para agregar un nuevo estudiante.
3. corrigiendo el siguiente error:
 3.1    schema.prisma quitar el ouput, luego en provider: agregar al final -js "provider = "prisma-client-js"
 3.2    Despues, regenerar la bd con el siguiente comanado de terminal: pnpm db:generate 
 3.3    y luego pnpm dev, listo. Servidor funcionando.
4. Agregar el codigo en try: 
const newStudent = await prisma.student.create({
            data:{
            nie: nie,
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            phone: phone,
            bithdate: birthdate ? new Date(birthdate) : null   
            }         
        })
        res.status(201).json({
            success: true,
            mensaje: 'Nuevo Alumno registrado exitosamente',
            data: newStudent
        });
    tener cuidado con los nombres de los campos creado en el modelo schema.prisma, por ejemplo el mio el campo de cumpleanos es bithdate, lo que sigue despues es la variable capturada del body del formulario.
5. probar en httpie y en Headers agregar x-api-key y {{APIKEY}}
6. en httpie proba la api tanto post como get
7. EL INGE DIO EL GET PARA OBTENER TODOS LOS REGISTROS DE LA TABLA
8. DE AHI SE HIZO EL UPDATE, AHI USER.ROUTES.JS ESTA EL CODIGO

//clases viernes 26 de junio

1. endpoint Delete, se agregara codigo de eliminar y luego usar con httpie
2. personalizar la validacion de los datos con zod.dev, instalar la libreria: pnpm add zod
3. importar su libreria: import { z } from 'zod';
4. validar con la siguiente instruccion: 
    const studentSchema = z.object({
    nie: z.string().min(5, { message: "El NIE debe tener al menos 5 caracteres" }).max(10, { message: "El NIE no puede tener más de 10 caracteres" }),
    

});
revisar la linea 9 de users.routes.js
5. USAR UNA CONSTANTE PARA VALIDAR, LINEA 19
6. luego de la validacion, encriptar la contrasena. pnpm add bcryptjs
7. importar la validacion import bcrypt from 'bcryptjs'; al inicio del codigo
8. luego en el endpoint create, crear una constante hashedPassword, luego sustituir la variable password por hashedPassword
9. proxima sesion se vera las sesiones de usuarios: jwt.io

Lunes 29/06/2026
1. JWT sirve para hacer autenticaciones, tokens. https://www.jwt.io/   Es un estandar en manejos de autenticación.
2. Hay que cuidar la parte de la firma en la seccion JWT ENCODER, asi como la duracion
3. HAY QUE INSTALAR JWT EN CONSOLA DE COMANDOS: pnpm add jsonwebtoken
4. Crear un archivo auth.routes.js en la carpeta routes.
5. y empezar a importar la libreria y una constante: 

    import {Router} from 'express';
    const authRouter = Router();

    authRouter.post('/login', async (req, res) => {
    res.status(200).json({message: "Funciona"})
    })

    al final agregar el codigo: export default authRouter
6. Luego en index,js importar el archivo import authRouter from './routes/auth.routes.js';
7. agregar el endpoint app.use('/auth', authRouter);
8. Luego probar con httpie esribiendo: POST localhost:8000/auth/login y agregando sus credenciales: x-api-key y {{APIKEY}}
9. ahora empezamos a validar los datos ingresados con ZOD, insertamos su import: import { z } from 'zod';
10. validamos con el siguiente codigo: 
    const loginSchema = z.object({
    email: z.string().email({ message: "El correo electrónico no es válido" }),
    password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .max(24,{message:"La contraseña no puede tener más de 24 caracteres"}),
})
11. AGREGAR LAS SIGUIENTES LINEAS DE CODIGO DE LA LINEA 16 EN ADELANTE.
12. AGREGAR EN EL ARCHIVO .ENV UNA LLAVE SECRETA PARA MI AUTENTICACION
JWT_SECRET = 'ezKYRJZ/g3Z+iy+E35lVxwVFeqUtyK5r0dzVMy3Pf7s='  INGRESANDO A ESTA PAGINA https://randomkeygen.com/
13. seguir siempre desde el punto 11.
14. correr en httpie para ver si funciona el login, 
{
"email":"mariefer@gmail.com",
"password":"12345678"  
}
post localhost:8000/auth/login
15. crear un archivo en la carpeta middleware con el nombre auth.middleware.js que es para proteger mis endpoint con un token de acceso: y se agrega el siguiente codigo.
//proteger mis rutas con un middleware que verifique el token
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, mensaje: 'Acceso no autorizado' });
    }
    const token = authHeader.split(' ')[1]; // Eliminar 'Bearer ' del inicio
    // Aquí iría la lógica para verificar el token
    next();
};
//Miercoles 01 de Julio de 2026
1. Se termina de agregar codigo en auth.middleware.js, para validar que no accedan a mis endpoints sin un token de acceso
2. 