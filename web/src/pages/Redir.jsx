// src/pages/Redir.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Redir() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const emailFromURL = new URLSearchParams(location.search).get("email");
    const email = emailFromURL || localStorage.getItem("email");

    if (!email) return navigate("/login");

    fetch(`http://localhost:4000/usuarios/info?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) return navigate("/login");

        // Guarda el token y redirige al rol correcte
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.rol);
        localStorage.setItem("nombre", data.nom);
        localStorage.setItem("usuari", JSON.stringify(data));
        localStorage.setItem("email", data.email);

        navigate(`/${data.rol}`);
      })
      .catch(() => navigate("/login"));
  }, [navigate, location]);

  return <p className="text-center mt-8">Redirigint...</p>;
}
