// src/components/Header.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { Sun, Moon } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [rol, setRol] = useState("");
  const [nombre, setNombre] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    const root = window.document.documentElement;
    setIsDarkMode(root.classList.contains("dark"));
    setRol(localStorage.getItem("rol") || "");
    setNombre(localStorage.getItem("nombre") || "");
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    root.classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const goTo = (path) => {
    setShowMenu(false);
    navigate(path);
  };

  return (
    <header className="flex justify-between items-center px-4 py-3 bg-black text-white shadow relative z-50">
      <div className="flex items-center space-x-2">
        <img src="/logo.png" alt="MoodTunes Logo" className="h-8" />
        <span className="font-bold text-xl">MoodTunes</span>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="text-xl">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button onClick={() => setShowMenu(!showMenu)} className="text-xl">
          <FiMenu size={22} />
        </button>

        <button
          onClick={logout}
          className="ml-2 text-sm px-3 py-1 rounded bg-red-500 hover:bg-red-600 transition"
        >
          <FiLogOut className="inline mr-1" />
          Sortir
        </button>
      </div>

      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-4 top-16 bg-white dark:bg-neutral-800 shadow-lg rounded-lg p-4 text-sm w-48 space-y-2 z-50"
        >
          <p className="text-muted-foreground font-medium mb-2">
            {nombre} ({rol})
          </p>

          {rol === "admin" && (
            <button onClick={() => goTo("/admin")} className="w-full text-left hover:underline">
              Admin Panel
            </button>
          )}

          {rol === "premium" && (
            <>
              <button onClick={() => goTo("/premium")} className="w-full text-left hover:underline">
                Premium Page
              </button>
              <button onClick={() => goTo("/recomanacions")} className="w-full text-left hover:underline">
                Recomanacions
              </button>
              <button onClick={() => goTo("/playlists")} className="w-full text-left hover:underline">
                Les meves Playlists
              </button>
              <button onClick={() => goTo("/reproductor")} className="w-full text-left hover:underline">
                Reproductor
              </button>
            </>
          )}

          {rol === "standard" && (
            <>
              <button onClick={() => goTo("/standard")} className="w-full text-left hover:underline">
                Standard Page
              </button>
              <button onClick={() => goTo("/recomanacions")} className="w-full text-left hover:underline">
                Recomanacions
              </button>
              <button onClick={() => goTo("/playlists")} className="w-full text-left hover:underline">
                Les meves Playlists
              </button>
              <button onClick={() => goTo("/reproductor")} className="w-full text-left hover:underline">
                Reproductor
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
