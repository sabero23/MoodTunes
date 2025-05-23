// src/pages/RecomanacionsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import { toast } from "react-toastify";

export default function RecomanacionsPage() {
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [modal, setModal] = useState({ open: false, track: null });
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");           // <-- nou
  const isPremium = rol === "premium";                 // <-- nou

  if (!token) navigate("/login");

  useEffect(() => {
    fetch("http://localhost:4000/api/recomanacions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setTracks(d.recomanacions || []))
      .catch(() => toast.error("No s'han pogut carregar recomanacions"));
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/playlists", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setPlaylists(d.playlists || []))
      .catch(() => toast.error("Error carregant playlists"));
  }, []);

  // Només navegació si és premium
  const hasNav = isPremium && tracks.length > 1;

  const prev = () => setIdx((i) => (i - 1 + tracks.length) % tracks.length);
  const next = () => setIdx((i) => (i + 1) % tracks.length);

  const openModal = (track) => setModal({ open: true, track });
  const closeModal = () => setModal({ open: false, track: null });

  const addToPlaylist = async (playlistId) => {
    const { track } = modal;
    try {
      const res = await fetch(
        `http://localhost:4000/playlists/${playlistId}/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            canco_id: track.id,
            nom_canco: track.name,
            artista: track.artists[0]?.name || "Desconegut",
            preview: track.preview_url,
            image: track.album?.images?.[0]?.url,
          }),
        }
      );
      if (res.ok) {
        toast.success("Cançó afegida!");
        closeModal();
      } else {
        const err = await res.json();
        toast.error(err.error || "Error afegint cançó");
      }
    } catch {
      toast.error("Error de connexió");
    }
  };

  return (
    <>
      <Header />

      <div
        className="
          min-h-screen w-full
          bg-gradient-to-br from-blue-100 to-blue-300
          dark:from-[#0b132b] dark:to-[#1c2541]
          flex items-center justify-center p-6
        "
      >
        <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl overflow-hidden">
          <h1 className="text-2xl font-bold text-center p-6 text-neutral-900 dark:text-white">
            Recomanacions per a tu
          </h1>

          <div className="relative">
            <AnimatePresence initial={false} mode="wait">
              {tracks[idx] && (
                <motion.div
                  key={tracks[idx].id}
                  initial={{ x: 200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -200, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-b-2xl bg-white dark:bg-neutral-800 min-h-[400px]"
                >
                  {tracks[idx].album?.images?.[0]?.url && (
                    <img
                      src={tracks[idx].album.images[0].url}
                      alt={tracks[idx].name}
                      className="w-full h-56 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                      {tracks[idx].name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {tracks[idx].artists[0]?.name}
                    </p>
                    <div className="flex gap-2">
                      <a
                        href={tracks[idx].external_urls.spotify}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-center rounded-lg"
                      >
                        Veure a Spotify
                      </a>
                      <button
                        onClick={() => openModal(tracks[idx])}
                        className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                      >
                        Afegir a playlist
                      </button>
                      {isPremium && (
                        <button
                          onClick={() =>
                            navigate("/reproductor", { state: { canco: track } })
                          }
                          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                        >
                          Reprodueix
                        </button>

                      )}
                    </div>
                    {hasNav && (
                      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                        {idx + 1} de {tracks.length}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {hasNav && (
              <>
                <button
                  onClick={prev}
                  className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full"
                >
                  ‹
                </button>
                <button
                  onClick={next}
                  className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {modal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">
              A quina playlist vols afegir la cançó?
            </h3>
            <select
              className="w-full mb-4 p-2 bg-gray-100 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg"
              onChange={(e) => addToPlaylist(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                – Selecciona –
              </option>
              {playlists.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nom}
                </option>
              ))}
            </select>
            <button
              onClick={closeModal}
              className="mt-2 w-full px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
            >
              Cancel·lar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
