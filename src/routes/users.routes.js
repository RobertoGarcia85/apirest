import {Router} from 'express';
import prisma from '../lib/prisma.js';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { authMiddleware } from '../middleware/auth.middleware.js';

//CREAR UNA INSTANCIA DE EXPRESS
const userRouter = Router();

//validacion con zod
const studentSchema = z.object({
    nie: z.string().min(5, { message: "El NIE debe tener al menos 5 caracteres" }).max(10, { message: "El NIE no puede tener más de 10 caracteres" }),
    firstname: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }).max(20, { message: "El nombre no puede tener más de  caracteres" }),
    lastname: z.string().min(3, { message: "El apellido debe tener al menos 3 caracteres" }).max(20, { message: "El apellido no puede tener más de 20 caracteres"}),
    email: z.string().email({ message: "El correo electrónico no es válido" }).trim().toLowerCase(),
    password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }).max(24,{message:"La contraseña no puede tener más de 24 caracteres"}),
    phone: z.string().optional(),
    birthdate: z.string().optional()  //regex("","") para validar un valor como el dui
})

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({success: false, errors: result.error.flatten().fieldErrors});
    }
    req. ValidatedBody = result.data;
    next();
}
// userRouter.get('/', (req, res) => {
//     //BUSCAR EN LA BASE DE DATOS
//     console.log('Alguien consulto el endopoint');
//     res.status(200).json({ mensaje: 'Endpoint de obtener funcionando' });
// });

//OBTENER TODOS LOS ALUMNOS DEL ENDPOINT
userRouter.get("/", async (req, res) => {
    // BUSCAR EN LA BASE DE DATOS
    try {
        const students = await prisma.student.findMany();
        res.status(200).json({ success: true, data: students });
    }       
    catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error al obtener los alumnos', error: error.message });
    }
  
});
 
//ENDPOINT DE TIPO POST
userRouter.post("/create", authMiddleware, validate(studentSchema), async(req, res) => {
    //EXTRACCION DE LOS DATOS DEL BODY
    const{nie, firstname,lastname, email, password, phone, birthdate} = req.body;

    // //VALIDACION DE DATOS MODO OGRO
    // if(!nie || !firstname || !lastname || !email || !password) {
    //     return res.status(400).json({ 
    //         success: false,
    //         mensaje: 'Faltan datos en el body'
    //     });
    // }
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newStudent = await prisma.student.create({
            data:{
            nie: nie,
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashedPassword,
            phone: phone,
            bithdate: birthdate ? new Date(birthdate) : null   
            }         
        })
        res.status(201).json({
            success: true,
            mensaje: 'Nuevo Alumno registrado exitosamente',
            data: newStudent
        });
    } 
    catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al registrar el Alumno',
            error: error.message
        });
    }
    
});
// userRouter.post("/create", async(req, res) => {
//     //RECIBIR LOS DATOS DEL BODY
//     const { nombre, edad } = req.body;
//     if(!nombre || !edad) {
//         return res.status(400).json({ mensaje: 'Faltan datos en el body' });
//     }else{
//         console.log(`Nombre: ${nombre}, Edad: ${edad}`);
//         res.status(201).json({ mensaje: 'Usuario creado exitosamente', data: { nombre, edad } });
//     }
    
// });
//ENDPOINT DE TIPO PUT ACTUALIZAR
userRouter.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const{nie, firstname,lastname, email, password, phone, birthdate} = req.body;
   try {
    const updatedStudent = await prisma.student.update({
        where: { id: parseInt(id) },
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
    res.status(200).json({ success: true, mensaje:'Informacion de Alumno Actualizado', data: updatedStudent });
} catch (error) {
    res.status(500).json({ success: false, mensaje: 'Error al actualizar el alumno', error: error.message });
}
});

//ENDPOINT DE TIPO DELETE
// ENDPOINT DE TIPO DELETE
userRouter.delete("/delete/:id", async (req, res) => {  // ← aquí va async
    const { id } = req.params;

    try {
        const deletedStudent = await prisma.student.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({
            success: true,
            mensaje: 'Alumno eliminado exitosamente',
            data: deletedStudent
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar el alumno',
            error: error.message
        });
    }
});

//MI PRIMER ENDPOINT
userRouter.get('/test', (req, res) => {
    //res.status(200).json({ mensaje: 'Hola desde mi primer API'});
    res.send('Hola desde mi primer API Roberto García');
});

export default userRouter;