// src/pages/PlaylistPage.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CreatePlaylist from "../components/CreatePlaylist";
import Header from "../components/Header";
import { motion } from "framer-motion";

export default function PlaylistPage() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tokenValid, setTokenValid] = useState(true);
  const [estatAnim, setEstatAnim] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const fetchPlaylists = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setTokenValid(false);
      setLoading(false);
      return;
    }
    fetch("http://localhost:4000/playlists", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 403) {
          setTokenValid(false);
          throw new Error();
        }
        return r.json();
      })
      .then((data) => setPlaylists(data.playlists || []))
      .catch(() => toast.error("Error carregant playlists"))
      .finally(() => setLoading(false));
  };

  const fetchMood = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:4000/mood/last", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => data.estat && setEstatAnim(data.estat))
      .catch(() => {});
  };

  useEffect(() => {
    fetchPlaylists();
    fetchMood();
  }, []);

  const eliminarPlaylist = async (id) => {
    const token = localStorage.getItem("token");
    toast.info("Eliminant playlist...");
    const res = await fetch(`http://localhost:4000/playlists/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      toast.success("✅ Playlist eliminada");
      fetchPlaylists();
    } else {
      toast.error("❌ Error en eliminar la playlist");
    }
  };

  const filtered = playlists.filter((p) =>
    p.nom.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 dark:from-[#0b132b] dark:to-[#1c2541]">
      <Header />

      {/* Espai extra sota el header */}
      <div className="pt-20 px-6 pb-10">
        {/* Títol i mood */}
        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Les meves Playlists
          </h2>
          {estatAnim && (
            <p className="text-center text-sm text-muted-foreground mt-1">
              Estat d'ànim actual: <strong>{estatAnim}</strong>
            </p>
          )}
        </div>

        {/* Cercador */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Cerca una playlist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
          />
        </div>

        {/* Nova playlist */}
        {tokenValid && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-md mx-auto bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-neutral-700 mb-12"
          >
            <h3 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-white">
              Nova Playlist
            </h3>
            <CreatePlaylist onCreated={fetchPlaylists} />
          </motion.div>
        )}

        {/* Llista o empty */}
        {filtered.length === 0 ? (
          <div className="text-center text-muted-foreground mt-16 space-y-4">
            <p>No tens cap playlist.</p>
            <img
              src="/empty-state.svg"
              alt="Sense playlists"
              className="mx-auto w-32 opacity-70"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-neutral-900 shadow-md rounded-xl overflow-hidden flex flex-col border border-gray-200 dark:border-neutral-800"
              >
                <div className="h-36 bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xl font-bold">
                  {p.nom}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-sm text-muted-foreground mb-2">
                    {p.descripcio || "Sense descripció"}
                  </p>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedPlaylist(p)}
                      className="text-sm px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Veure
                    </button>
                    <button
                      onClick={() => eliminarPlaylist(p.id)}
                      className="text-sm px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ───────── Modal inline ───────── */}
      {selectedPlaylist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedPlaylist.nom}
              </h3>
              <button
                onClick={() => setSelectedPlaylist(null)}
                className="text-sm text-muted-foreground hover:underline"
              >
                Tancar
              </button>
            </div>
            {selectedPlaylist.descripcio && (
              <p className="text-sm text-muted-foreground mb-6">
                {selectedPlaylist.descripcio}
              </p>
            )}

            {/* Aquí carreguem els items de la playlist */}
            <PlaylistItems playlistId={selectedPlaylist.id} />

          </div>
        </div>
      )}
    </div>
  );
}


// Component intern per llistar items
function PlaylistItems({ playlistId }) {
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:4000/playlists/${playlistId}/items`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setItems(data.items || []))
      .catch(() => toast.error("❌ Error carregant cançons"))
      .finally(() => setLoadingItems(false));
  }, [playlistId]);

  if (loadingItems) return <p>Carregant cançons...</p>;
  if (items.length === 0)
    return <p className="text-center text-muted-foreground">No hi ha cançons.</p>;

  return (
    <ul className="space-y-4 max-h-80 overflow-y-auto">
      {items.map((it) => (
        <li
          key={it.inserted_at}
          className="flex items-center gap-4 border-b pb-3 last:border-none"
        >
          <img
            src={it.image}
            alt={it.nom_canco}
            className="w-12 h-12 rounded object-cover"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white">
              {it.nom_canco}
            </p>
            <p className="text-sm text-muted-foreground">{it.artista}</p>
          </div>
          <a
            href={`https://open.spotify.com/track/${it.canco_id}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Spotify
          </a>
        </li>
      ))}
    </ul>
  );
}
