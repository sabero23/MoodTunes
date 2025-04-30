import Header from '../components/Header';
import './RolePages.css';

export default function AdminPage() {
  return (
    <>
      <Header />
      <div className="page-container">
        <h1 className="page-title">Bienvenido, administrador</h1>
        <p className="page-subtitle">¿Cómo te sientes hoy?</p>
        <div className="selector-placeholder">Selector de estado de ánimo (próximamente)</div>
        <p className="extra-info">
          Zona de administración: aquí podrás gestionar usuarios, consultar estadísticas u otras
          funcionalidades exclusivas para administradores.
        </p>
      </div>
    </>
  );
}
