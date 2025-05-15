// src/pages/RecomanacionsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function RecomanacionsPage() {
  const [recomanacions, setRecomanacions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    fetch("http://localhost:4000/api/recomanacions", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.recomanacions) setRecomanacions(data.recomanacions);
      })
      .catch((err) => console.error("Error obtenint recomanacions:", err));
  }, [navigate]);

  return (
    <div className="min-h-screen px-6 py-8 bg-background text-foreground">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-sm font-medium bg-muted px-3 py-1.5 rounded hover:bg-muted/80 transition"
      >
        <FiArrowLeft /> Tornar
      </button>

      <h2 className="text-2xl font-bold mb-6">Recomanacions musicals</h2>

      {recomanacions.length === 0 ? (
        <p>No s'han trobat recomanacions.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {recomanacions.map((canco, index) => (
            <div
              key={index}
              className="bg-card rounded-xl shadow-lg p-4 hover:shadow-xl transition cursor-pointer"
              onClick={() => navigate("/reproductor", { state: { canco } })}
            >
              <div className="text-lg font-semibold">{canco.nom_canco}</div>
              <div className="text-sm text-muted-foreground">{canco.artista}</div>
              <a
                href={`https://open.spotify.com/track/${canco.canco_id}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm text-primary hover:underline"
              >
                Obrir a Spotify
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
