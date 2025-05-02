// src/pages/ConnectSpotify.jsx
import { useEffect } from 'react';

export default function ConnectSpotify() {
  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      window.location.href = `https://https://97e3-80-32-100-140.ngrok-free.app/auth/spotify?email=${email}`;
    }
  }, []);

  return <p style={{ color: 'white', textAlign: 'center' }}>Redirigiendo a Spotify...</p>;
}
