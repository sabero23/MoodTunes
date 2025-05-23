// src/components/Header.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  Menu as MenuIcon,
  LogOut,
  Shield,
  User,
  Music,
  List,
  PlayCircle,
} from "lucide-react";

export default function Header() {
  const nav = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [rol, setRol] = useState("");
  const [nom, setNom] = useState("");
  const menuRef = useRef();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    setRol(localStorage.getItem("rol") || "");
    setNom(localStorage.getItem("nom") || "");
  }, []);

  // tanca el menú si fas clic fora
  useEffect(() => {
    const handler = (e) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark((v) => !v);
  };

  const logout = () => {
    localStorage.clear();
    nav("/login");
  };

  const goTo = (path) => {
    setOpen(false);
    nav(path);
  };

  const logoSrc = "/logo_moodtunes_blue.png";
  const txt = isDark ? "text-white" : "text-black";
  const hoverBg = isDark ? "hover:bg-gray-800/30" : "hover:bg-gray-200/50";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center 
                  justify-between px-6 py-3 shadow-md
                  ${isDark ? "bg-black" : "bg-white"}`}
    >
      <div className="flex items-center gap-3">
        <img
          src={logoSrc}
          alt="MoodTunes"
          className="h-8 w-auto"
          style={isDark ? { filter: "invert(1)" } : {}}
        />
        <span className={`font-semibold text-xl ${txt}`}>MoodTunes</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className={`p-1 bg-transparent ${txt} ${hoverBg} rounded transition`}
          aria-label="Canvia tema"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          onClick={() => setOpen((v) => !v)}
          className={`p-1 bg-transparent ${txt} ${hoverBg} rounded transition`}
          aria-label="Obre menú"
        >
          <MenuIcon size={24} />
        </button>
      </div>

      {open && (
        <div
          ref={menuRef}
          className={`absolute right-6 top-full mt-2 w-56 rounded-lg 
                      shadow-lg ring-1 ring-black/20
                      ${isDark ? "bg-black text-white" : "bg-white text-black"}`}
        >
          <div
            className={`px-4 py-3 border-b ${
              isDark ? "border-gray-700/50" : "border-gray-300"
            }`}
          >
            <p className="font-medium">{nom}</p>
            <p className="text-xs text-gray-400 uppercase">{rol}</p>
          </div>
          <nav className="flex flex-col">
            {rol === "admin" && (
              <button
                onClick={() => goTo("/admin")}
                className={`flex items-center gap-2 px-4 py-3 bg-transparent ${hoverBg} ${txt} transition`}
              >
                <Shield size={16} /> Panell d’Admin
              </button>
            )}

            {(rol === "standard" || rol === "premium") && (
              <>
                <button
                  onClick={() => goTo(`/${rol}`)}
                  className={`flex items-center gap-2 px-4 py-3 bg-transparent ${hoverBg} ${txt} transition`}
                >
                  <User size={16} /> La meva pàgina
                </button>
                <button
                  onClick={() => goTo("/recomanacions")}
                  className={`flex items-center gap-2 px-4 py-3 bg-transparent ${hoverBg} ${txt} transition`}
                >
                  <Music size={16} /> Recomanacions
                </button>
                <button
                  onClick={() => goTo("/playlists")}
                  className={`flex items-center gap-2 px-4 py-3 bg-transparent ${hoverBg} ${txt} transition`}
                >
                  <List size={16} /> Les meves playlists
                </button>

                {rol === "premium" && (
                  <button
                    onClick={() => goTo("/reproductor")}
                    className={`flex items-center gap-2 px-4 py-3 bg-transparent ${hoverBg} ${txt} transition`}
                  >
                    <PlayCircle size={16} /> Reproductor
                  </button>
                )}
              </>
            )}

            <button
              onClick={logout}
              className="mt-1 flex items-center gap-2 px-4 py-3 
                         bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-b-lg transition"
            >
              <LogOut size={16} /> Tancar sessió
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
