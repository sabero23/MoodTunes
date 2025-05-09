import { useEffect, useState, forwardRef, useImperativeHandle } from "react";

const Playlists = forwardRef((props, ref) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarPlaylists = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    fetch("http://localhost:4000/playlists", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPlaylists(data.playlists || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Error:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    carregarPlaylists();
  }, []);

  // expose la funció perquè pugui ser cridada des de fora
  useImperativeHandle(ref, () => ({
    refrescar: carregarPlaylists,
  }));

  if (loading) return <p>Carregant playlists...</p>;
  if (playlists.length === 0) return <p>No tens cap playlist.</p>;

  return (
    <div>
      <h2>Les meves Playlists</h2>
      <ul>
  {playlists.map((p) => (
    <li key={p.id} style={{ marginBottom: "1rem" }}>
      <strong>{p.nom}</strong> — {p.descripcio || "Sense descripció"}
      <div>
        <em>(Contingut: {p.canco_count || 0} cançons)</em>
      </div>
      <button onClick={() => eliminarPlaylist(p.id)}>🗑️ Eliminar</button>
    </li>
  ))}
</ul>

    </div>
  );
});

export default Playlists;
