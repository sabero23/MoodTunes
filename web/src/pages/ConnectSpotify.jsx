// src/pages/ConnectSpotify.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function ConnectSpotify() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const iniciarSpotify = () => {
    const email = localStorage.getItem('email');
    if (email) {
      window.location.href = `http://localhost:4000/auth/spotify?email=${email}`;
    }
  };

  return (
    <div className="main-container">
      <h1>Conecta tu cuenta de Spotify</h1>
      <p>Necesitamos que conectes tu cuenta para ofrecerte recomendaciones.</p>
      <button className="spotify-button" onClick={iniciarSpotify}>
        Iniciar sesión con Spotify
      </button>
    </div>
  );
}
