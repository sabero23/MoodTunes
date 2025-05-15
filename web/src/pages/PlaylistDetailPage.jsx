import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";

export default function PlaylistDetailPage() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:4000/playlists/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPlaylist(data.playlist);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error carregant la playlist:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center">Carregant...</p>;

  if (!playlist) return <p className="text-center text-red-500">Playlist no trobada.</p>;

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <Header />
      <h1 className="text-2xl font-bold mb-2">{playlist.nom}</h1>
      <p className="text-muted-foreground mb-4">{playlist.descripcio}</p>
      <p className="text-sm text-gray-500 mb-6">🎶 0 cançons (placeholder)</p>

      {/* Aquí podràs mostrar cançons quan les tinguis */}
      <p className="text-center text-muted-foreground">Aquesta playlist encara no té cançons.</p>
    </div>
  );
}
