import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../pages/Login.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Register() {
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [contrasenya, setContrasenya] = useState("");
  const [rol, setRol] = useState("standard");
  const [dataNaixement, setDataNaixement] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          nom,
          contrasenya,
          rol,
          data_naixement: dataNaixement,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        toast.success("Usuari creat correctament!");
        setTimeout(() => navigate("/login"), 2500);
      } else {
        toast.error(data.error || "Error desconegut al registrar");
      }
    } catch (err) {
      toast.error("Error de connexió amb el servidor");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <img src="/logo.png" alt="Logo" className="login-logo" />
        <h2 className="login-title">Crear un nou compte</h2>

        <label className="login-label">Usuari</label>
        <input
          type="text"
          className="login-input"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
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

        <label className="login-label">Correu electrònic</label>
        <input
          type="email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="login-label">Data de naixement</label>
        <input
          type="date"
          className="login-input"
          value={dataNaixement}
          onChange={(e) => setDataNaixement(e.target.value)}
          required
        />

        <label className="login-label">Tipus de compte</label>
        <select
          className="login-input"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          required
        >
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
        </select>

        <button type="submit" className="login-btn">
          Crear el compte
        </button>

        <p className="login-register">
          Ja tens un compte?
          <span onClick={() => navigate("/login")} className="register-inline">
            {" "}Inicia la sessió
          </span>
        </p>
      </form>
    </div>
  );
}
