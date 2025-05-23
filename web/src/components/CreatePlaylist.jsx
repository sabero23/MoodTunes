// src/components/CreatePlaylist.jsx
import { useState } from "react";
import { toast } from "react-toastify";

export default function CreatePlaylist({ onCreated }) {
  const [nom, setNom] = useState("");
  const [descripcio, setDescripcio] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:4000/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nom, descripcio }),
      });
      if (!res.ok) throw new Error();
      toast.success("✅ Playlist creada!");
      setNom("");
      setDescripcio("");
      onCreated();  // refresca la llista
    } catch {
      toast.error("❌ Error creant playlist");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder="Nom de la playlist"
        className="w-full px-3 py-2 border rounded"
        required
      />
      <textarea
        value={descripcio}
        onChange={(e) => setDescripcio(e.target.value)}
        placeholder="Descripció (opcional)"
        className="w-full px-3 py-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        Crear Playlist
      </button>
    </form>
  );
}
