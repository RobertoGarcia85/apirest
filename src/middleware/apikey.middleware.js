export const apikeymiddleware = (req, res, next) => {
    const apikey = req.headers['x-api-key']; 
    if (!apikey ||apikey !== process.env.API_KEY) {
        return res.status(401).json({ message: 'API key is missing or invalid' });
    }
    next();
}