import 'dotenv/config';
import express from 'express';
import userRouter from './routes/users.routes.js';
import { apikeymiddleware } from './middleware/apikey.middleware.js';
import authRouter from './routes/auth.routes.js';

//CREAR UNA INSTANCIA DE EXPRESS
const app = express();
//CONFIGURAR EL PUERTO
const PORT = process.env.PORT
//ESPECIFICAR JSON
app.use(express.json());

//MIDDLEWARES
app.use(apikeymiddleware);

//ENDPOINTS
app.use('/', userRouter);
app.use('/auth', authRouter);




//INICIAR EL SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT} 📎`);
});      