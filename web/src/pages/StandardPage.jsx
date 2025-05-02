import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StandardPage() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [spotifyNombre, setSpotifyNombre] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const nombreGuardado = localStorage.getItem('nombre');
    const nombreSpotify = localStorage.getItem('spotify_nombre');

    if (!token) {
      navigate('/login');
    } else {
      setNombre(nombreGuardado || 'Usuario estándar');
      setSpotifyNombre(nombreSpotify || '');
    }
  }, [navigate]);

  return (
    <div className="main-container">
      <h1>Bienvenido, {nombre}</h1>
      {spotifyNombre && <h2>Cuenta de Spotify: {spotifyNombre}</h2>}
      <p>¿Cómo te sientes hoy?</p>
      <button className="selector-button" disabled>
        Selector de estado de ánimo (próximamente)
      </button>
    </div>
  );
}
