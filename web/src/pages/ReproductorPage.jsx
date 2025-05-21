// src/pages/ReproductorPage.jsx
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";

export default function ReproductorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [canco, setCanco] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);
  const playerRef = useRef(null);

  // Obtener el usuario y su rol
  const usuari = JSON.parse(localStorage.getItem("usuari") || "{}");
  const isPremium = usuari?.rol === "premium";

  useEffect(() => {
    if (!location.state?.canco) {
      navigate(-1);
      return;
    }
    setCanco(location.state.canco);
  }, [location, navigate]);

  // Si es premium, cargamos el SDK y creamos el player
  useEffect(() => {
    if (!isPremium || !canco) return;

    // 1) Inyectar el script del SDK
    const tag = document.createElement("script");
    tag.src = "https://sdk.scdn.co/spotify-player.js";
    document.body.appendChild(tag);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = localStorage.getItem("token"); // tu JWT, que el backend intercambiará por un token Spotify
      const player = new window.Spotify.Player({
        name: "MoodTunes Player",
        getOAuthToken: cb => { cb(token); },
        volume: 0.8
      });
      playerRef.current = player;

      // Escuchar estado “ready”
      player.addListener("ready", ({ device_id }) => {
        console.log("▶️ Spotify Player listo en device:", device_id);
        setPlayerReady(device_id);
        // Opcional: transferir playback al dispositivo
        fetch("https://api.spotify.com/v1/me/player", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ device_ids: [device_id] })
        });
      });

      player.connect();
    };

    // Cleanup
    return () => {
      if (playerRef.current) playerRef.current.disconnect();
    };
  }, [isPremium, canco]);

  if (!canco) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 flex items-center gap-2 text-sm text-gray-300 hover:underline"
      >
        <FiArrowLeft /> Tornar
      </button>

      <Card className="w-full max-w-md overflow-hidden">
        <CardHeader>
          <CardTitle>Now Playing</CardTitle>
          <CardDescription>
            {canco.name} — {canco.artist}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <img
            src={canco.image}
            alt={canco.name}
            className="w-full h-48 object-cover rounded-lg"
          />

          {isPremium ? (
            <>
              {!playerReady ? (
                <p className="mt-4 text-center text-sm text-gray-500">
                  Conectando al reproductor…
                </p>
              ) : (
                <div className="mt-4 flex justify-center gap-4">
                  <Button
                    onClick={() =>
                      playerRef.current.togglePlay().catch(e => console.error(e))
                    }
                  >
                    Play/Pause
                  </Button>
                  <Button
                    onClick={() =>
                      playerRef.current.previousTrack().catch(e => console.error(e))
                    }
                  >
                    ◀◀
                  </Button>
                  <Button
                    onClick={() =>
                      playerRef.current.nextTrack().catch(e => console.error(e))
                    }
                  >
                    ▶▶
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              {canco.preview ? (
                <audio
                  src={canco.preview}
                  controls
                  className="w-full mt-4"
                />
              ) : (
                <div className="mt-4 p-4 text-center text-sm text-gray-500">
                  No hi ha previsualització.
                </div>
              )}
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          {!isPremium && (
            <Button
              onClick={() => window.open(canco.uri, "_blank")}
            >
              Obre a Spotify
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
