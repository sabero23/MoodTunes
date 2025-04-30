import { useNavigate } from "react-router-dom";               // Hook de React Router para redirecciones
import { toast } from "react-toastify";                      // Importa el sistema de notificaciones (toast)

// Componente para gestionar el cierre de sesión
export default function LogoutButton() {
  const navigate = useNavigate();                            // Permite redirigir al usuario a otras rutas

  // Función que gestiona el logout
  const handleLogout = () => {
    localStorage.removeItem("token");                        // Elimina el token de sesión del almacenamiento local
    toast.success("Sessió tancada correctament");            // Muestra notificación de éxito tras cerrar sesión
    navigate("/login");                                      // Redirige al usuario a la pantalla de login
  };

  // Botón visual que al hacer clic ejecuta la función de logout
  return (
    <button onClick={handleLogout} style={{ marginTop: "20px" }}>
      Tancar sessió
    </button>
  );
}
