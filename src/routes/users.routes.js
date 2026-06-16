import {Router} from 'express';
//CREAR UNA INSTANCIA DE EXPRESS
const userRouter = Router();

userRouter.get('/', (req, res) => {
    //BUSCAR EN LA BASE DE DATOS
    console.log('Alguien consulto el endopoint');
    res.status(200).json({ mensaje: 'Endpoint de obtener funcionando' });
});
//ENDPOINT DE TIPO POST
userRouter.post("/create", (req, res) => {
    //RECIBIR LOS DATOS DEL BODY
    const { nombre, edad } = req.body;
    if(!nombre || !edad) {
        return res.status(400).json({ mensaje: 'Faltan datos en el body' });
    }else{
        console.log(`Nombre: ${nombre}, Edad: ${edad}`);
        res.status(201).json({ mensaje: 'Usuario creado exitosamente', data: { nombre, edad } });
    }
    
});
//ENDPOINT DE TIPO PUT
userRouter.put("/update/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, edad } = req.body;
    if(!nombre || !edad) {
        return res.status(400).json({ mensaje: 'Faltan datos: nombre o edad' });
    }else{
        console.log(`Nombre: ${nombre}, Edad: ${edad}`);
        res.status(200).json({ mensaje: `El usuario con ID ${id} ha sido actualizado`});
    }
});

//ENDPOINT DE TIPO DELETE
userRouter.delete("/delete/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, edad } = req.body;
    if(!nombre || !edad) {
        return res.status(400).json({ mensaje: 'Faltan datos: nombre o edad' });
    }else{
        console.log(`Nombre: ${nombre}, Edad: ${edad}`);
        res.status(200).json({ mensaje: `El usuario con ID ${id} ha sido eliminado`});
    }
});

//MI PRIMER ENDPOINT
userRouter.get('/test', (req, res) => {
    //res.status(200).json({ mensaje: 'Hola desde mi primer API'});
    res.send('Hola desde mi primer API Roberto García');
});

export default userRouter;