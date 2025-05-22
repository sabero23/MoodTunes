// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";

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

        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        localStorage.setItem("nombre", data.nom);
        localStorage.setItem("rol", data.rol);
        localStorage.setItem("nom", data.nom);      // coincide con ThemeToggle
        localStorage.setItem("usuari", JSON.stringify(data));

        setTimeout(() => navigate(`/${data.rol}`), 1500);
      } else {
        toast.error(data.error || "Credencials incorrectes");
      }
    } catch {
      toast.error("Error de connexió amb el servidor");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 to-blue-300 dark:from-[#0b132b] dark:to-[#1c2541] flex items-center justify-center px-4 relative">
      {/* Toggle de tema */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <motion.form
        onSubmit={iniciarSessio}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-xl space-y-6"
      >
        <div className="text-center">
          <img src="/logo_moodtunes_blue.svg" alt="MoodTunes" className="w-16 mx-auto mb-2 dark:hidden" />
          <img src="/logo_moodtunes_white.svg" alt="MoodTunes" className="w-16 mx-auto mb-2 hidden dark:block" />
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
            Benvingut a MoodTunes
          </h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Correu electrònic
          </label>
          <input
            type="email"
            className="mt-1 w-full px-4 py-2 border rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Contrasenya
          </label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 border rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={contrasenya}
              onChange={(e) => setContrasenya(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-xl text-neutral-500 cursor-pointer"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Inicia la sessió
        </button>

        <p className="text-sm text-center text-neutral-600 dark:text-neutral-400">
          No tens un compte?
          <span
            onClick={() => navigate("/register")}
            className="ml-1 underline cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-800"
          >
            Registra't
          </span>
        </p>
      </motion.form>
    </div>
  );
}
