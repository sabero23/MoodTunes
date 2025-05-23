// src/pages/ReproductorPage.jsx
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

export default function ReproductorPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const track = state?.canco;
  const playerRef = useRef(null);
  const [deviceId, setDeviceId] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const token = localStorage.getItem("token");
  if (!token) navigate("/login");

  useEffect(() => {
    if (!track) return navigate("/recomanacions");

    // 1. Carrega l'SDK de Spotify
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "MoodTunes Web Player",
        getOAuthToken: (cb) => cb(token),
        volume: 0.7,
      });

      playerRef.current = player;

      // 2. Esdeveniments del player
      player.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);

        // Envia la comanda de reproducció
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: [track.uri],
            position_ms: 0,
          }),
        });
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) return;
        setPlaying(!state.paused);
        setPosition(state.position);
        setDuration(state.duration);
      });

      player.connect();
    };

    return () => {
      // Desconnecta al desmontar
      playerRef.current?.disconnect();
    };
  }, [track, token, navigate]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (playing) {
      playerRef.current.pause();
    } else {
      playerRef.current.resume();
    }
    setPlaying((p) => !p);
  };

  const seek = (ms) => {
    playerRef.current?.seek(ms);
  };

  const fmt = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const m = String(Math.floor(totalSec / 60)).padStart(2, "0");
    const s = String(totalSec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!track) return null;

  return (
    <div className="flex justify-center items-center min-h-screen p-6 bg-gradient-to-br from-blue-100 to-blue-300 dark:from-[#0b132b] dark:to-[#1c2541]">
      <Card className="w-full max-w-md bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
        <CardHeader>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-muted-foreground hover:underline mb-2"
          >
            <FiArrowLeft className="inline mr-1" />
            Tornar
          </button>
          <CardTitle>Now Playing</CardTitle>
          <CardDescription>
            {track.name} — {track.artists[0]?.name}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <img
            src={track.album.images[0]?.url}
            alt={track.name}
            className="w-full h-48 object-cover rounded-md"
          />

          <div className="flex items-center space-x-2">
            <input
              type="range"
              min={0}
              max={duration}
              value={position}
              onChange={(e) => seek(Number(e.target.value))}
              className="flex-1"
            />
            <div className="text-xs text-muted-foreground">
              {fmt(position)} / {fmt(duration)}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center space-x-4 pb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => seek(0)}
          >
            <SkipBack />
          </Button>
          <Button
            size="icon"
            className="bg-primary text-primary-foreground"
            onClick={togglePlay}
          >
            {playing ? <Pause /> : <Play />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => seek(duration)}
          >
            <SkipForward />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
