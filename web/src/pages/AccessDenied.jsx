import { useNavigate } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";
import ThemeToggle from "../components/ThemeToggle";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-100 dark:from-neutral-900 dark:to-slate-800 transition-colors relative">
      <ThemeToggle />

      <div className="bg-white dark:bg-neutral-900 text-center p-10 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 max-w-md w-full">
        <div className="flex justify-center items-center mb-6">
          <FiAlertTriangle className="text-red-500 dark:text-red-400 text-5xl" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Accés denegat
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          No tens permisos per accedir a aquesta secció.
        </p>

        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 rounded-lg bg-blue-600 dark:bg-blue-500 text-white font-medium hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors"
        >
          Tornar a l'inici
        </button>
      </div>
    </div>
  );
}
