import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Acceso denegado. No hay token o el formato es inválido.' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    console.error('❌ Error al verificar token:', error.message);
    return res.status(403).json({ error: 'Token inválido o expirado.' });
  }
};