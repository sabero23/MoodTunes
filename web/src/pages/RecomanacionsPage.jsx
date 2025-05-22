// src/pages/RecomanacionsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RecomanacionsPage() {
  const [loading, setLoading] = useState(true);
  const [tracks, setTracks] = useState([]);
  const navigate = useNavigate();
  const rol = localStorage.getItem("rol"); // "standard" o "premium"

  useEffect(() => {
    const fetchRecs = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("❌ Sessió caducada. Torna a iniciar sessió.");
        navigate("/login");
        return;
      }

      try {
        const resp = await fetch("http://localhost:4000/api/recomanacions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) {
          const err = await resp.json().catch(() => null);
          throw new Error(err?.error || `Status ${resp.status}`);
        }
        const { recomanacions } = await resp.json();
        setTracks(recomanacions);
      } catch (err) {
        console.error(err);
        toast.error("❌ No s'han pogut carregar recomanacions");
      } finally {
        setLoading(false);
      }
    };

    fetchRecs();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-white">Carregant recomanacions…</p>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-center px-4">
        <p className="text-white text-lg">
          No hi ha recomanacions per avui. Guarda un estat d'ànim primer!
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tracks.map((t) => (
        <div
          key={t.id}
          className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-lg"
        >
          {t.album?.images?.[0]?.url && (
            <img
              src={t.album.images[0].url}
              alt={t.name}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="font-semibold text-lg text-neutral-800 dark:text-white">
              {t.name}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              {t.artists.map((a) => a.name).join(", ")}
            </p>

            {rol === "premium" ? (
              <button
                onClick={() =>
                  navigate("/reproductor", { state: { trackId: t.id } })
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
              >
                Reproduir aquí
              </button>
            ) : (
              <button
                onClick={() =>
                  window.open(t.external_urls.spotify, "_blank")
                }
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
              >
                Reprodueix a Spotify
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
