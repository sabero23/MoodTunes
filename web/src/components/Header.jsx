import { useNavigate } from 'react-router-dom';
import { FiMenu, FiLogOut } from 'react-icons/fi';
import { useState } from 'react';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const [menuObert, setMenuObert] = useState(false);

  const logout = () => {
    localStorage.removeItem('usuari');
    navigate('/login');
  };

  return (
    <header className="header">
      <img src="/logo.png" alt="MoodTunes Logo" className="header-logo" />
      <button className="menu-icon" onClick={() => setMenuObert(!menuObert)}>
        <FiMenu />
      </button>

      {menuObert && (
        <div className="menu-desplegable">
          <button className="menu-item" onClick={logout}>
            <FiLogOut className="icon" /> Tancar sessió
          </button>
        </div>
      )}
    </header>
  );
}