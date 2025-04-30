import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPage from './pages/AdminPage';
import PremiumPage from './pages/PremiumPage';
import StandardPage from './pages/StandardPage';
import AccessDenied from './pages/AccessDenied';
import { ToastContainer } from 'react-toastify';
import Redir from './pages/Redir';
import 'react-toastify/dist/ReactToastify.css';

function ProtectedRoute({ element, allowedRoles }) {
  const usuari = JSON.parse(localStorage.getItem('usuari'));
  const rol = usuari?.rol;

  return allowedRoles.includes(rol) ? element : <Navigate to="/denegat" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/denegat" element={<AccessDenied />} />

        <Route
          path="/admin"
          element={<ProtectedRoute allowedRoles={['admin']} element={<AdminPage />} />}
        />
        <Route
          path="/premium"
          element={<ProtectedRoute allowedRoles={['premium']} element={<PremiumPage />} />}
        />
        <Route
          path="/standard"
          element={<ProtectedRoute allowedRoles={['standard']} element={<StandardPage />} />}
        />
        <Route path="/redir" element={<Redir />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;
