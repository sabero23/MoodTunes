// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";

export default function Register() {
  const [usuari, setUsuari] = useState("");
  const [email, setEmail] = useState("");
  const [contrasenya, setContrasenya] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dataNaix, setDataNaix] = useState("");
  const [tipusCompte, setTipusCompte] = useState("standard");
  const navigate = useNavigate();

  const creaCompte = async (e) => {
    e.preventDefault();

    try {
      const resposta = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuari,
          email,
          contrasenya,
          dataNaix,
          rol: tipusCompte,
        }),
      });

      const data = await resposta.json();

      if (resposta.ok) {
        toast.success("Compte creat correctament!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(data.error || "Error en crear el compte");
      }
    } catch {
      toast.error("Error de connexió amb el servidor");
    }
  };

  return (
    <div className="min-h-screen w-full 
                    bg-gradient-to-br from-blue-100 to-blue-300 
                    dark:from-[#0b132b] dark:to-[#1c2541] 
                    flex items-center justify-center px-4 relative">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <motion.form
        onSubmit={creaCompte}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-neutral-900 
                   p-8 rounded-2xl shadow-xl space-y-6"
      >
        <div className="text-center">
          <img
            src="/logo_moodtunes_blue.svg"
            alt="MoodTunes"
            className="w-16 mx-auto mb-2"
          />
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
            Crea un nou compte
          </h2>
        </div>

        <div>
          <label className="block text-sm font-medium 
                            text-neutral-700 dark:text-neutral-300">
            Nom d'usuari
          </label>
          <input
            type="text"
            className="mt-1 w-full px-4 py-2 border rounded-lg 
                       bg-neutral-50 dark:bg-neutral-800 
                       text-neutral-900 dark:text-white 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={usuari}
            onChange={(e) => setUsuari(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium 
                            text-neutral-700 dark:text-neutral-300">
            Correu electrònic
          </label>
          <input
            type="email"
            className="mt-1 w-full px-4 py-2 border rounded-lg 
                       bg-neutral-50 dark:bg-neutral-800 
                       text-neutral-900 dark:text-white 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium 
                            text-neutral-700 dark:text-neutral-300">
            Contrasenya
          </label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 border rounded-lg 
                         bg-neutral-50 dark:bg-neutral-800 
                         text-neutral-900 dark:text-white 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={contrasenya}
              onChange={(e) => setContrasenya(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-xl 
                         text-neutral-500 dark:text-neutral-400 
                         cursor-pointer"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium 
                            text-neutral-700 dark:text-neutral-300">
            Data de naixement
          </label>
          <input
            type="date"
            className="mt-1 w-full px-4 py-2 border rounded-lg 
                       bg-neutral-50 dark:bg-neutral-800 
                       text-neutral-900 dark:text-white 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={dataNaix}
            onChange={(e) => setDataNaix(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium 
                            text-neutral-700 dark:text-neutral-300">
            Tipus de compte
          </label>
          <select
            className="mt-1 w-full px-4 py-2 border rounded-lg 
                       bg-neutral-50 dark:bg-neutral-800 
                       text-neutral-900 dark:text-white 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={tipusCompte}
            onChange={(e) => setTipusCompte(e.target.value)}
          >
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 
                     text-white font-semibold py-2 px-4 
                     rounded-lg transition-colors"
        >
          Crear el compte
        </button>

        <p className="text-sm text-center text-neutral-600 dark:text-neutral-400">
          Ja tens un compte?
          <span
            onClick={() => navigate("/login")}
            className="ml-1 underline cursor-pointer 
                       text-blue-600 dark:text-blue-400 
                       hover:text-blue-800"
          >
            Inicia la sessió
          </span>
        </p>
      </motion.form>
    </div>
  );
}
