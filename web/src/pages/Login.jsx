import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../pages/Login.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [contrasenya, setContrasenya] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const iniciarSessio = async (e) => {
    e.preventDefault();

    try {
      const resposta = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasenya }),
      });

      const data = await resposta.json();

      if (resposta.ok) {
        toast.success("Sessió iniciada correctament!");
        localStorage.setItem("usuari", JSON.stringify(data));

        // Redirigeix segons el rol
        setTimeout(() => {
          navigate(`/${data.rol}`);
        }, 1500);
      } else {
        toast.error(data.error || "Credencials incorrectes");
      }
    } catch (err) {
      toast.error("Error de connexió amb el servidor");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={iniciarSessio}>
        <img src="/logo.png" className="login-logo" alt="MoodTunes Logo" />
        <h2 className="login-title">Benvingut a MoodTunes</h2>

        <label className="login-label">Correu electrònic</label>
        <input
          type="email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="login-label">Contrasenya</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            className="login-input"
            value={contrasenya}
            onChange={(e) => setContrasenya(e.target.value)}
            required
          />
          <span
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <button type="submit" className="login-btn">
          Inicia la sessió
        </button>

        <p className="login-register">
          No tens un compte?
          <span onClick={() => navigate("/register")} className="register-inline">
            {" "}Registra't
          </span>
        </p>
      </form>
    </div>
  );
}
