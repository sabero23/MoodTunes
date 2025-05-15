import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import MoodSelectorMagic from "../components/MoodSelectorMagic";

export default function PremiumPage() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [spotifyLinked, setSpotifyLinked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const nombreGuardado = localStorage.getItem("nombre");
    const email = localStorage.getItem("email");

    if (!token || !email) {
      navigate("/login");
    } else {
      setNombre(nombreGuardado || "Usuari");

      fetch(`http://localhost:4000/usuarios/info?email=${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.spotify_refresh_token) {
            setSpotifyLinked(true);
          }
        });
    }
  }, [navigate]);

  const loginSpotify = async () => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:4000/auth/spotify?email=${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.redirected) {
        window.location.href = res.url;
      }
    } catch (err) {
      console.error("Error al iniciar sesión con Spotify:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex flex-col items-center justify-center px-4 py-10">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Benvingut, <span className="text-primary">{nombre}</span>
        </h1>

        {!spotifyLinked ? (
          <div className="text-center max-w-md mt-6 space-y-4">
            <p className="text-lg text-muted-foreground font-semibold">
              Abans d'utilitzar el servei, <br /> has de vincular el teu compte Spotify:
            </p>
            <button
              onClick={loginSpotify}
              className="mt-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Iniciar sessió amb Spotify
            </button>
          </div>
        ) : (
          <MoodSelectorMagic />
        )}
      </div>
    </div>
  );
}
