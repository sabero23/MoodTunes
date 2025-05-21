import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CreatePlaylist from "../components/CreatePlaylist";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

export default function PlaylistPage() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tokenValid, setTokenValid] = useState(true);
  const [estatAnim, setEstatAnim] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [newSong, setNewSong] = useState("");

  const fetchPlaylists = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setTokenValid(false);
      return;
    }

    fetch("http://localhost:4000/playlists", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 403) {
          setTokenValid(false);
          throw new Error("Token invàlid");
        }
        return res.json();
      })
      .then((data) => {
        setPlaylists(data.playlists || []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Error carregant playlists");
        setLoading(false);
      });
  };

  const fetchMood = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:4000/mood/last", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.estat) {
          setEstatAnim(data.estat);
        }
      })
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      toast.success("✅ Playlist eliminada");
      fetchPlaylists();
    } else {
      toast.error("❌ Error en eliminar la playlist");
    }
  };

  const afegirCanco = async () => {
    if (!newSong.trim()) return;
    toast.info("Afegint cançó...");

    setTimeout(() => {
      toast.success("🎵 Cançó afegida (simulat)");
      setNewSong("");
    }, 1000);
  };

  const filteredPlaylists = playlists.filter((p) =>
    p.nom.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center">Carregant playlists...</p>;

  return (
    <div className="px-6 py-10">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-primary">
        Les meves Playlists
      </h2>

      {estatAnim && (
        <div className="text-center text-muted-foreground mb-6">
          <p className="text-sm">Estat d'ànim actual: <strong>{estatAnim}</strong></p>
        </div>
      )}

      <div className="flex justify-center mb-6 max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Cerca una playlist..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm"
        />
      </div>

      {tokenValid && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto bg-white dark:bg-neutral-900 shadow-lg p-6 rounded-2xl mb-10 border border-gray-200 dark:border-neutral-700"
        >
          <h3 className="text-xl font-semibold text-center mb-4 text-gray-700 dark:text-white">
            Nova Playlist
          </h3>
          <CreatePlaylist onCreated={fetchPlaylists} />
        </motion.div>
      )}

      {selectedPlaylist && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-lg font-bold mb-2">{selectedPlaylist.nom}</h3>
            <p className="mb-4 text-sm text-muted-foreground">{selectedPlaylist.descripcio}</p>
            <p className="text-xs text-gray-500">🎵 0 cançons (encara per implementar)</p>

            <div className="mt-6">
              <input
                type="text"
                placeholder="Afegir cançó..."
                value={newSong}
                onChange={(e) => setNewSong(e.target.value)}
                className="w-full mb-3 px-3 py-2 rounded border text-sm border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800"
              />
              <button
                onClick={afegirCanco}
                className="text-sm px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Afegir cançó
              </button>
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedPlaylist(null)}
                className="text-sm px-4 py-1.5 bg-gray-300 dark:bg-neutral-700 text-black dark:text-white rounded hover:bg-gray-400 dark:hover:bg-neutral-600"
              >
                Tancar
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredPlaylists.length === 0 ? (
        <div className="text-center text-muted-foreground mt-10">
          <p>No tens cap playlist.</p>
          <img
            src="/empty-state.svg"
            alt="Sense playlists"
            className="mx-auto mt-4 w-32 opacity-70"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {filteredPlaylists.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-neutral-900 shadow-md rounded-xl overflow-hidden transition hover:shadow-2xl flex flex-col border border-gray-200 dark:border-neutral-800"
            >
              <div className="h-36 bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xl font-bold">
                {p.nom}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {p.descripcio || "Sense descripció"}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    🎵 0 cançons
                  </div>
                </div>
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
  );
}
