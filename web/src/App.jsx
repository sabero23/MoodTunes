import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Rutes temporals */}
        <Route path="/admin" element={<h2>Admin Dashboard</h2>} />
        <Route path="/premium" element={<h2>Premium Area</h2>} />
        <Route path="/standard" element={<h2>Standard Area</h2>} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
