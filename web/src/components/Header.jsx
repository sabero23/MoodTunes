import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [menuObert, setMenuObert] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("usuari");
    navigate("/login");
  };

  // Carregar tema des de localStorage
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <header className="w-full px-4 py-3 bg-white dark:bg-neutral-950 shadow-md flex items-center justify-between z-50 relative">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img
          src="/logo.png"
          alt="MoodTunes Logo"
          className="h-8 w-auto object-contain"
        />
        <span className="font-bold text-lg text-neutral-800 dark:text-white">
          MoodTunes
        </span>
      </div>

      {/* Botons dreta */}
      <div className="flex items-center space-x-4">
        {/* Tema */}
        <button
          onClick={toggleTheme}
          className="text-neutral-800 dark:text-white text-xl hover:scale-110 transition"
          title="Canviar tema"
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>

        {/* Menú */}
        <button
          onClick={() => setMenuObert(!menuObert)}
          className="text-neutral-800 dark:text-white text-xl"
        >
          <FiMenu />
        </button>
      </div>

      {/* Menú desplegable */}
      <AnimatePresence>
        {menuObert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-4 top-16 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg p-3 w-48"
          >
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 text-left text-sm font-medium text-neutral-800 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 p-2 rounded-lg"
            >
              <FiLogOut className="text-lg" /> Tancar sessió
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
