// src/pages/StandardPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MoodSelectorMagic from "../components/MoodSelectorMagic";

export default function StandardPage() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [spotifyLinked, setSpotifyLinked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const nombreGuardado = localStorage.getItem("nombre");
    const email = localStorage.getItem("email");

    if (!token || !email) {
      navigate("/login");
      return;
    }

    setNombre(nombreGuardado || "Usuari");
    fetch(`http://localhost:4000/usuarios/info?email=${email}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.spotify_refresh_token) {
          setSpotifyLinked(true);
        }
      })
      .catch(() => {
        toast.error("No s'ha pogut comprovar l'estat de Spotify");
      });
  }, [navigate]);

  const loginSpotify = () => {
    const email = localStorage.getItem("email");
    if (email) {
      window.location.href = `http://localhost:4000/auth/spotify?email=${email}`;
    }
  };

  return (
    <div
      className="
        min-h-screen w-full 
        bg-gradient-to-br from-blue-100 to-blue-300 
        dark:from-[#0b132b] dark:to-[#1c2541]
        flex items-center justify-center
      "
    >
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-xl space-y-6">
        <div className="text-center">
          <img
            src="/logo_moodtunes_blue.svg"
            alt="MoodTunes"
            className="w-16 mx-auto mb-2 dark:hidden"
          />
          <img
            src="/logo_moodtunes_white.svg"
            alt="MoodTunes"
            className="w-16 mx-auto mb-2 hidden dark:block"
          />
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
            Benvingut,{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {nombre}
            </span>
          </h2>
        </div>

        {!spotifyLinked ? (
          <div className="space-y-4">
            <p className="text-center text-neutral-700 dark:text-neutral-300">
              Abans d'utilitzar el servei, has de vincular el teu compte Spotify.
            </p>
            <button
              onClick={loginSpotify}
              className="
                w-full bg-green-500 hover:bg-green-600 
                text-white font-semibold py-2 rounded-lg 
                transition-colors
              "
            >
              Inicia sessió amb Spotify
            </button>
          </div>
        ) : (
          <MoodSelectorMagic />
        )}
      </div>
    </div>
  );
}
