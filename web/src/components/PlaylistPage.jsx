// src/pages/PlaylistPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreatePlaylist from "../components/CreatePlaylist";
import { toast } from "react-toastify";

export default function PlaylistPage() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPlaylists = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:4000/playlists", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPlaylists(data.playlists);
    } catch {
      toast.error("❌ Error carregant playlists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlaylists(); }, []);

  if (loading) return <p>Carregant...</p>;
  if (!playlists.length) return <p>No tens cap playlist.</p>;

  return (
    <div className="px-6 py-10">
      <h2 className="text-3xl font-bold mb-6">Les meves Playlists</h2>
      <CreatePlaylist onCreated={fetchPlaylists} />
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((p) => (
          <div key={p.id}
               className="border rounded-lg p-4 shadow hover:shadow-lg transition">
            <h3 className="font-semibold">{p.nom}</h3>
            <p className="text-sm mb-2">{p.descripcio || "Sense descripció"}</p>
            <button
              onClick={() => navigate(`/playlists/${p.id}`)}
              className="text-blue-600 hover:underline"
            >
              Veure
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
