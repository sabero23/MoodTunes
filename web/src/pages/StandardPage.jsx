import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RolePages.css';

export default function StandardPage() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const nombreGuardado = localStorage.getItem('nombre');
    const email = localStorage.getItem('email');

    if (!token) {
      navigate('/login');
    } else {
      setNombre(nombreGuardado || 'Usuario estándar');
      verificarSpotify(email);
    }
  }, [navigate]);

  const verificarSpotify = async (email) => {
    try {
      const res = await fetch(`http://localhost:4000/check-spotify?email=${email}`);
      const data = await res.json();
      setSpotifyConnected(data.connected);
      setLoading(false);
    } catch (error) {
      console.error('Error verificando conexión con Spotify', error);
      setLoading(false);
    }
  };

  const loginSpotify = () => {
    const email = localStorage.getItem('email');
    window.location.href = `https://97e3-80-32-100-140.ngrok-free.app/auth/spotify?email=${email}`;
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="main-container">
      <h1>Bienvenido, {nombre}</h1>
      {!spotifyConnected ? (
        <>
          <p>Antes de usar MoodTunes debes iniciar sesión con Spotify.</p>
          <button className="spotify-button" onClick={loginSpotify}>
            Iniciar sesión con Spotify
          </button>
        </>
      ) : (
        <>
          <p>¿Cómo te sientes hoy?</p>
          <button className="selector-button">
            Selector de estado de ánimo (disponible)
          </button>
        </>
      )}
    </div>
  );
}
