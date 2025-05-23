// src/components/MoodSelectorMagic.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";

const moods = [
  { id: "muy_mal",   label: "Muy mal",     color: "from-red-500 to-red-700" },
  { id: "mal",       label: "Mal",         color: "from-orange-500 to-orange-700" },
  { id: "algo_mal",  label: "Algo mal",    color: "from-amber-400 to-amber-600" },
  { id: "normal",    label: "Normal",      color: "from-gray-400 to-gray-600" },
  { id: "bien",      label: "Bien",        color: "from-green-400 to-green-600" },
  { id: "muy_bien",  label: "Muy bien",    color: "from-emerald-400 to-emerald-600" },
  { id: "motivado",  label: "Motivado",    color: "from-blue-500 to-indigo-700" },
];

export default function MoodSelectorMagic() {
  const [selectedIndex, setSelectedIndex] = useState(3); // per defecte "Normal"
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();
  const selectedMood = moods[selectedIndex];

  // Detectem tema
  useEffect(() => {
    const cls = document.documentElement.classList;
    setIsDark(cls.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(cls.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const textColor = isDark ? "text-white" : "text-black";

  const handleNext = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("❌ Sessió caducada. Torna a iniciar sessió.");
      navigate("/login");
      return;
    }

    try {
      // 1) Guardem l'estat al backend
      const resp = await fetch("http://localhost:4000/api/estat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estat: selectedMood.id }),
      });
      const data = await resp.json();

      if (!resp.ok) {
        toast.error(data.error || "❌ Error al desar l'estat");
        return;
      }

      // 2) Si tot ok, redirigim a recomanacions
      toast.success("✅ Estat d'ànim guardat!");
      navigate("/recomanacions");
    } catch (err) {
      console.error(err);
      toast.error("Error de connexió amb el servidor");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto text-center p-6">
      <h2 className={`text-xl font-semibold mb-6 ${textColor}`}>
        ¿Cómo te has sentido en general hoy?
      </h2>

      <div className="relative w-40 h-40 mx-auto mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMood.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: [1, 1.1, 1] }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.6 }}
            className={`rounded-full w-40 h-40 bg-gradient-to-br ${selectedMood.color} shadow-xl`}
          />
        </AnimatePresence>
        <motion.div
          className="absolute inset-0 border-4 border-white border-opacity-10 rounded-full animate-pulse"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />
      </div>

      <div className={`text-lg font-bold mb-4 ${textColor}`}>
        {selectedMood.label}
      </div>

      <div className="w-full mb-6">
        <input
          type="range"
          min="0"
          max={moods.length - 1}
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-sm mb-2">
          <span className={textColor}>{moods[0].label}</span>
          <span className={textColor}>{moods[moods.length - 1].label}</span>
        </div>
      </div>

      <Button onClick={handleNext} className="w-full">
        Siguiente
      </Button>
    </div>
  );
}
