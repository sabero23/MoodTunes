import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:4000/playlists", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPlaylists(data.playlists || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error carregant playlists:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center">Carregant playlists...</p>;

  if (playlists.length === 0)
    return <p className="text-center text-muted-foreground">No tens cap playlist.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {playlists.map((p) => (
        <div
          key={p.id}
          className="bg-white dark:bg-neutral-900 shadow-md rounded-lg p-4 transition hover:shadow-xl"
        >
          <h3 className="text-lg font-bold text-primary mb-1">{p.nom}</h3>
          <p className="text-sm text-muted-foreground mb-2">
            {p.descripcio || "Sense descripció"}
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            🎶 0 cançons {/* Aquí pots mostrar count real si ho tens */}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => navigate(`/playlist/${p.id}`)}
              className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Veure
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
