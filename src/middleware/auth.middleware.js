import jwt from 'jsonwebtoken';


//proteger mis rutas con un middleware que verifique el token
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, mensaje: 'Acceso no autorizado' });
    }
    const token = authHeader.split(' ')[1]; // Eliminar 'Bearer ' del inicio
    // Aquí iría la lógica para verificar el token
    try{
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, mensaje: 'Token de acceso inválido' });
    }
    
};