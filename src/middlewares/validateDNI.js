import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
import Employee from '../models/employee.model.js';

export const validatedni = (req, res, next) => {
  const { token } = req.cookies;

  console.log(req.cookies)

  if (!token)
    return res.status(401).json({ message: 'Unauthorized' })

  jwt.verify(token, TOKEN_SECRET, async (err, decodedToken) => {
    if (err)
      return res.status(403).json({ message: 'Invalid token' });
      
    // Busca el usuario en la base de datos usando el ID del token decodificado
    try {
      const user = await Employee.findById( decodedToken.id);
      
      if (!user)
        return res.status(404).json({ message: 'User not found' });

      // Añade el DNI del usuario a req.user.dni si está presente
      if (user.dni) {
        req.user = {
          ...decodedToken, // Conserva la información del token decodificado
          dni: user.dni // Añade el DNI del usuario
        };
      } else {
        req.user = decodedToken; // Si el usuario no tiene DNI, usa solo la información del token decodificado
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
};