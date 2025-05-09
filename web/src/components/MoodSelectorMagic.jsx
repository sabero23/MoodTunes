import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button"; // de shadcn

const moods = [
  { id: "muy_mal", label: "Muy mal", color: "from-red-500 to-red-700" },
  { id: "mal", label: "Mal", color: "from-orange-500 to-orange-700" },
  { id: "algo_mal", label: "Algo mal", color: "from-amber-400 to-amber-600" },
  { id: "normal", label: "Normal", color: "from-gray-400 to-gray-600" },
  { id: "bien", label: "Bien", color: "from-green-400 to-green-600" },
  { id: "muy_bien", label: "Muy bien", color: "from-emerald-400 to-emerald-600" },
  { id: "motivado", label: "Motivado", color: "from-blue-500 to-indigo-700" },
];

export default function MoodSelectorMagic() {
  const [selectedIndex, setSelectedIndex] = useState(3); // "Normal"

  const selectedMood = moods[selectedIndex];

  const handleNext = () => {
    alert(`Has seleccionado: ${selectedMood.label}`);
  };

  return (
    <div className="w-full max-w-md mx-auto text-center p-6">
      <h2 className="text-xl font-semibold mb-6 text-white">
        ¿Cómo te has sentido en general hoy?
      </h2>

      {/* Icono animado */}
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

      {/* Etiqueta */}
      <div className="text-lg font-bold text-white mb-4">
        {selectedMood.label}
      </div>

      {/* Slider */}
      <div className="w-full mb-6">
        <input
          type="range"
          min="0"
          max={moods.length - 1}
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-sm text-white text-opacity-70 mt-2">
          <span>{moods[0].label}</span>
          <span>{moods[moods.length - 1].label}</span>
        </div>
      </div>

      {/* Botón */}
      <Button onClick={handleNext} className="w-full">
        Siguiente
      </Button>
    </div>
  );
}
