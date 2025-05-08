import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import MoodSelector from "../components/MoodSelectorMagic";

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

      fetch(`http://localhost:4000/usuarios/info?email=${email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.spotify_refresh_token) {
            setSpotifyLinked(true);
          }
        });
    }
  }, [navigate]);

  const loginSpotify = () => {
    const email = localStorage.getItem("email");
    window.location.href = `http://localhost:4000/auth/spotify?email=${email}`;
  };

  return (
    <div className="premium-page">
      <Header />
      <div className="main-container">
        <h1>Benvingut, {nombre}</h1>
        {!spotifyLinked ? (
          <>
            <p>Abans d'utilitzar el servei, has de vincular el teu compte Spotify:</p>
            <button onClick={loginSpotify}>Iniciar sessió amb Spotify</button>
          </>
        ) : (
          <MoodSelector />
        )}
      </div>
    </div>
  );
}
