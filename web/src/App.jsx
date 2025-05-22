import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPage from './pages/AdminPage';
import PremiumPage from './pages/PremiumPage';
import StandardPage from './pages/StandardPage';
import RecomanacionsPage from './pages/RecomanacionsPage';
import ReproductorPage from './pages/ReproductorPage';
import AccessDenied from './pages/AccessDenied';
import ConnectSpotify from './pages/ConnectSpotify';
import Redir from './pages/Redir';
import PlaylistPage from './pages/PlaylistPage'; // ✅ Afegit
import PlaylistDetailPage from './pages/PlaylistDetailPage';
import Layout from './components/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProtectedRoute({ element, allowedRoles }) {
  const usuari = JSON.parse(localStorage.getItem("usuari"));
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
        <Route path="/connect-spotify" element={<ConnectSpotify />} />
        <Route path="/redir" element={<Redir />} />

        {/* Pàgines protegides amb Layout */}
        <Route
          path="/admin"
          element={
            <Layout>
              <ProtectedRoute allowedRoles={["admin"]} element={<AdminPage />} />
            </Layout>
          }
        />
        <Route
          path="/premium"
          element={
            <Layout>
              <ProtectedRoute allowedRoles={["premium"]} element={<PremiumPage />} />
            </Layout>
          }
        />
        <Route
          path="/standard"
          element={
            <Layout>
              <ProtectedRoute allowedRoles={["standard"]} element={<StandardPage />} />
            </Layout>
          }
        />

        <Route
          path="/recomanacions"
          element={
            <Layout>
              <ProtectedRoute allowedRoles={["standard", "premium"]} element={<RecomanacionsPage />} />
            </Layout>
          }
        />
        <Route
          path="/reproductor"
          element={
            <Layout>
              <ProtectedRoute allowedRoles={["standard", "premium"]} element={<ReproductorPage />} />
            </Layout>
          }
        />

        <Route
          path="/playlists"
          element={<ProtectedRoute allowedRoles={['standard', 'premium']} element={<PlaylistPage />} />}
        />
        {/* 👆 permet accés a standard i premium */}
        <Route
          path="/playlist/:id"
          element={<ProtectedRoute allowedRoles={['standard', 'premium']} element={<PlaylistDetailPage />} />}
        />
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
