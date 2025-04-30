import { useNavigate } from 'react-router-dom';              // Hook de React Router para la navegación entre rutas
import { FiMenu, FiLogOut } from 'react-icons/fi';          // Iconos de menú y logout de la librería react-icons
import { useState } from 'react';                           // Hook para la gestión de estado local (abrir/cerrar menú)
import './Header.css';                                      // Importación de los estilos del header

// Componente Header (barra superior de navegación)
export default function Header() {
  const navigate = useNavigate();                           // Hook para redirecciones entre rutas
  const [menuObert, setMenuObert] = useState(false);        // Estado para controlar si el menú está abierto o cerrado

  // Función para cerrar sesión: elimina el usuario del localStorage y redirige al login
  const logout = () => {
    localStorage.removeItem('usuari');                      // Elimina la información de sesión almacenada en localStorage
    navigate('/login');                                     // Redirige al login tras cerrar sesión
  };

  return (
    <header className="header">
      {/* Logo de la aplicación */}
      <img src="/logo.png" alt="MoodTunes Logo" className="header-logo" />

      {/* Botón para abrir/cerrar el menú desplegable */}
      <button className="menu-icon" onClick={() => setMenuObert(!menuObert)}>
        <FiMenu />                                           {/* Icono de menú */}
      </button>

      {/* Menú desplegable, solo se muestra si menuObert es true */}
      {menuObert && (
        <div className="menu-desplegable">
          <button className="menu-item" onClick={logout}>
            <FiLogOut className="icon" /> Tancar sessió      {/* Botón de logout con icono */}
          </button>
        </div>
      )}
    </header>
  );
}
