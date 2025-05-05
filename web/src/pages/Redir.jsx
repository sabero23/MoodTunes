import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Redir() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get("email");

    if (!email) return navigate("/login");

    fetch(`http://localhost:4000/usuarios/info?email=${email}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) return navigate("/login");

        localStorage.setItem("email", email);
        localStorage.setItem("nombre", data.nom);
        localStorage.setItem("rol", data.rol);
        localStorage.setItem("token", data.token);

        if (!data.spotify_refresh_token) {
          navigate("/connect-spotify");
        } else {
          navigate(`/${data.rol}`);
        }
      })
      .catch(() => navigate("/login"));
  }, [location, navigate]);

  return null;
}
