import { Navigate } from 'react-router-dom';          // Permite redirigir al usuario a otras rutas
import jwtDecode from 'jwt-decode';                   // Librería para decodificar el token JWT

/**
 * Componente que protege las rutas según el rol del usuario.
 * 
 * @param {ReactNode} children - Componente hijo que solo se mostrará si el usuario tiene acceso.
 * @param {Array} allowedRoles - Lista de roles que tienen permiso para acceder a la ruta.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');        // Recupera el token JWT almacenado en localStorage

  // Si no hay token, redirige a la página de error
  if (!token) return <Navigate to="/error" />;

  try {
    const decoded = jwtDecode(token);                 // Decodifica el token para obtener los datos del usuario

    // Verifica si el rol del usuario está permitido
    if (!allowedRoles.includes(decoded.rol)) {
      return <Navigate to="/error" />;                // Si el rol no es válido, redirige a la página de error
    }

    return children;                                 // Si el rol es correcto, permite el acceso a la ruta protegida
  } catch (err) {
    return <Navigate to="/error" />;                  // Si el token es inválido o hay algún error, redirige a error
  }
}
