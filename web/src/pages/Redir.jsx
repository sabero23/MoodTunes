// src/pages/Redir.jsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Redir() {
  const navigate = useNavigate();

  useEffect(() => {
    // Obtenemos el email guardado en localStorage
    const email = localStorage.getItem('email');

    if (!email) {
      // Si no hay email guardado, volver al login
      navigate('/login');
      return;
    }

    // Comprobamos si el usuario ya está conectado a Spotify
    const checkSpotifyConnection = async () => {
      try {
        const response = await fetch(`http://localhost:4000/check-spotify?email=${email}`);
        const data = await response.json();

        if (data.connected) {
          // Si ya está conectado, lo mandamos directamente a su página
          const usuario = JSON.parse(localStorage.getItem('usuari'));
          if (usuario?.rol) {
            navigate(`/${usuario.rol}`);
          } else {
            navigate('/login');
          }
        } else {
          // Si no está conectado, lo mandamos a conectar
          navigate('/connect-spotify');
        }
      } catch (err) {
        console.error('Error verificando conexión Spotify:', err);
        navigate('/login');
      }
    };

    checkSpotifyConnection();
  }, [navigate]);

  return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>
      Verificando tu conexión con Spotify...
    </div>
  );
}
