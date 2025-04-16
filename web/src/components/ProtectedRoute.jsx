import { Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/error" />;

  try {
    const decoded = jwtDecode(token);
    if (!allowedRoles.includes(decoded.rol)) {
      return <Navigate to="/error" />;
    }
    return children;
  } catch (err) {
    return <Navigate to="/error" />;
  }
}
