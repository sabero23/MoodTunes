import { useState } from "react";

function CreatePlaylist({ onCreated }) {
  const [nom, setNom] = useState("");
  const [descripcio, setDescripcio] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validació bàsica
    if (!nom.trim()) {
      alert("❌ El nom de la playlist és obligatori");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("No s'ha trobat cap token. Torna a iniciar sessió.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nom, descripcio }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Playlist creada!");
        setNom("");
        setDescripcio("");
        if (onCreated) onCreated(); // refresca llistat si ve de props
      } else {
        alert(data.error || "❌ Error al crear la playlist");
      }
    } catch (err) {
      console.error("❌ Error en la petició:", err);
      alert("Error de connexió amb el servidor.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
      <h3>Nova Playlist</h3>
      <input
        type="text"
        placeholder="Nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        required
        style={{ display: "block", marginBottom: "0.5rem" }}
      />
      <input
        type="text"
        placeholder="Descripció (opcional)"
        value={descripcio}
        onChange={(e) => setDescripcio(e.target.value)}
        style={{ display: "block", marginBottom: "0.5rem" }}
      />
      <button type="submit">Crear</button>
    </form>
  );
}

export default CreatePlaylist;
