import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Sessió tancada correctament");
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} style={{ marginTop: "20px" }}>
      Tancar sessió
    </button>
  );
}
