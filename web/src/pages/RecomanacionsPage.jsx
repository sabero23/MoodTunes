// RecomanacionsPage.jsx amb estètica Magic UI
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Music } from 'lucide-react';

export default function RecomanacionsPage() {
  const [cancons, setCancons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    fetch('http://localhost:4000/api/recomanacions', {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw data;
        setCancons(data.recomanacions);
      })
      .catch(err => {
        console.error('Error HTTP recomanacions:', err);
        toast.error(err.error || 'Error al carregar recomanacions');
      });
  }, []);

  return (
    <div style={{ padding: '2rem', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Music size={24} /> Recomanacions segons el teu estat d'ànim
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {cancons.map((canco, i) => (
          <div key={i} style={{
            background: 'linear-gradient(to bottom right, #1e3a8a, #0f172a)',
            borderRadius: '1rem',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <img src={canco.album?.images?.[0]?.url} alt={canco.name} style={{ width: '100%', borderRadius: '0.75rem', marginBottom: '0.75rem' }} />
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{canco.name}</h2>
            <p style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>{canco.artists?.[0]?.name}</p>
            <a href={canco.external_urls?.spotify} target="_blank" rel="noreferrer"
              style={{
                marginTop: '0.75rem',
                display: 'inline-block',
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '0.5rem',
                textDecoration: 'none'
              }}>
              Escolta-la a Spotify
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
