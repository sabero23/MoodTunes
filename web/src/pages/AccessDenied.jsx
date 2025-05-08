import { useNavigate } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="access-denied-container">
      <div className="access-denied-box">
        <FiAlertTriangle size={60} color="#fff" />
        <h2>Accés Denegat</h2>
        <p>No tens permisos per accedir a aquesta pàgina.</p>
        <button className="access-btn" onClick={() => navigate("/login")}>
          Tornar al Login
        </button>
      </div>
    </div>
  );
}
