import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";

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
    } catch {
      toast.error("Error de connexió amb el servidor");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 to-blue-300 dark:from-[#0b132b] dark:to-[#1c2541] flex items-center justify-center px-4 relative">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-xl space-y-6"
      >
        <div className="text-center">
          <img src="/logo.png" alt="Logo" className="w-16 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
            Crear un nou compte
          </h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Usuari
          </label>
          <input
            type="text"
            className="mt-1 w-full px-4 py-2 border rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
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

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Data de naixement
          </label>
          <input
            type="date"
            className="mt-1 w-full px-4 py-2 border rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={dataNaixement}
            onChange={(e) => setDataNaixement(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Tipus de compte
          </label>
          <select
            className="mt-1 w-full px-4 py-2 border rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            required
          >
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Crear el compte
        </button>

        <p className="text-sm text-center text-neutral-600 dark:text-neutral-400">
          Ja tens un compte?
          <span
            onClick={() => navigate("/login")}
            className="ml-1 underline cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-800"
          >
            Inicia la sessió
          </span>
        </p>
      </motion.form>
    </div>
  );
}
