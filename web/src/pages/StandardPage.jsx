import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MoodSelectorMagic from "../components/MoodSelectorMagic";
import Playlists from "../components/Playlists";
import CreatePlaylist from "../components/CreatePlaylist";

export default function StandardPage() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const nombreGuardado = localStorage.getItem("nom") || "Usuari de prova";
    const email = localStorage.getItem("email");

    if (!token || !email) {
      navigate("/login");
    } else {
<<<<<<< HEAD
      setNombre(nombreGuardado);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

=======
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

  const loginSpotify = () => {
    const email = localStorage.getItem("email");
    if (email) {
      window.location.href = `http://localhost:4000/auth/spotify?email=${email}`;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
>>>>>>> 44f321b9e27379ef06ba58518dbdf45849dba3ac
      <div className="flex flex-col items-center justify-center px-4 py-10">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Benvingut, <span className="text-primary">{nombre}</span>
        </h1>

        <div className="w-full max-w-3xl mt-10 space-y-8">
          <MoodSelectorMagic />
       
     
        </div>
      </div>
    </div>
  );
}
