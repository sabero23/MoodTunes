import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
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
      setNombre(nombreGuardado);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

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
