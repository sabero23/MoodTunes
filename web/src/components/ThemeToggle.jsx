// src/components/ThemeToggle.jsx
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Al montar, aplicar theme guardado
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    document.documentElement.classList.toggle("dark", newDark);
    setIsDark(newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Canvia tema"
      className={`
        p-2 rounded 
        transition-opacity duration-200
        ${isDark
          ? "bg-black text-white border border-white"
          : "bg-white text-black border border-black"}
        hover:opacity-75
      `}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
