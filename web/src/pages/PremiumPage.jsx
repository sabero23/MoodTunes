import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PremiumPage() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [tokenSpotify, setTokenSpotify] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const nombreGuardado = localStorage.getItem('nombre');
    const refresh = localStorage.getItem('spotify_refresh_token');

    if (!token) {
      navigate('/login');
    } else if (!refresh) {
      navigate('/connect-spotify');
    } else {
      setNombre(nombreGuardado || 'Usuario premium');
      setTokenSpotify(refresh);
    }
  }, [navigate]);

  return (
    <div className="main-container">
      <h1>Bienvenido, {nombre}</h1>
      <p>¿Cómo te sientes hoy?</p>
      <button className="selector-button" disabled>
        Selector de estado de ánimo (próximamente)
      </button>
    </div>
  );
}
