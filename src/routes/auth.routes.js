import {Router} from 'express'; //las llevas son porque son modulos instalados
import prisma from '../lib/prisma.js'; //importamos la instancia de prisma para poder usarla en este archivo
import bcrypt from 'bcryptjs'; //importamos bcrypt para poder hashear la contraseña
import jwt from 'jsonwebtoken'; //importamos jsonwebtoken para poder generar el token
//CREAR UNA INSTANCIA DE zod
import { z } from 'zod';

const authRouter = Router();

//esquema de validacion para el login
const loginSchema = z.object({
    email: z.string().email({ message: "El correo electrónico no es válido" }),
    password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .max(24,{message:"La contraseña no puede tener más de 24 caracteres"}),
})

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({success: false, errors: result.error.flatten().fieldErrors});
    }
    req. ValidatedBody = result.data;
    next();
}

//ENDPOINT DE LOGIN
authRouter.post('/login', validate(loginSchema), async (req, res) => {
    const { email, password } = req.body;
    try{
        const student = await prisma.student.findUnique({
            where: {
                email: email
            }
        });
        if (!student) {
            return res.status(401).json({ success: false, mensaje: 'Credenciales incorrectas' });
        }

        const isPasswordValid = await bcrypt.compare(password, student.password); //devuelve true o false si la contraseña es correcta
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, mensaje: 'Credenciales incorrectas' });
        }
        //generar el token asi como se hizo en la pagina web
        const payload = {
            id: student.id,
            email: student.email,
            studentCode: student.nie        };
        //generar el token con la libreria jsonwebtoken y la clave secreta que se encuentra en el archivo .env
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.status(200).json({ success: true, access_toke: token });

    }
    catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error al iniciar el servidor'});
        console.log(error);

    }
})

export default authRouter