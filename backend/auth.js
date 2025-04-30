// ----------------------------
// auth.js - Middleware de autenticación y control de acceso
// ----------------------------

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Carga las variables de entorno desde el .env (como el JWT_SECRET)
dotenv.config();

/**
 * Middleware para proteger rutas: Verifica si el usuario tiene un token JWT válido.
 * - Si el token es correcto, añade los datos del usuario decodificados a req.user.
 * - Si no hay token o es inválido, devuelve un error 401 o 403.
 */
export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;

  // Comprobamos si el header Authorization está presente
  if (!authHeader) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  // Extraemos el token del header (formato: "Bearer token")
  const token = authHeader.split(' ')[1];

  try {
    // Verificamos que el token sea válido usando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardamos los datos del usuario decodificados en la request
    next(); // Si todo está bien, pasamos al siguiente middleware o ruta
  } catch {
    // Si el token no es válido o ha expirado
    res.status(403).json({ error: 'Token inválido' });
  }
}

/**
 * Middleware para permitir acceso solo a usuarios con un rol específico.
 * - Se usa después de `authRequired` para comprobar el rol del usuario.
 * - Ejemplo de uso: `onlyRole('admin')`
 */
export function onlyRole(rol) {
  return (req, res, next) => {
    if (req.user?.rol === rol) {
      next(); // Si el usuario tiene el rol adecuado, continuamos
    } else {
      res.status(403).json({ error: 'Acceso denegado' }); // Si no, denegamos el acceso
    }
  };
}
