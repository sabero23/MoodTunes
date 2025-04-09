import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [contrasenya, setContrasenya] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, contrasenya })
      })

      const data = await resposta.json()

      if (resposta.ok) {
        navigate(`/${data.rol}`)
      } else {
        setError(data.error || 'Error de connexió')
      }
    } catch (err) {
      setError('No s’ha pogut connectar amb el servidor')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/logo.png" alt="Logo MoodTunes" className="login-logo" />
        <h1 className="login-title">Benvingut a <br />MoodTunes</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="login-input"
            placeholder="Usuari"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="login-input"
            placeholder="Contrasenya"
            value={contrasenya}
            onChange={(e) => setContrasenya(e.target.value)}
          />
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn">Inicia la sessió</button>
        </form>
        <a href="#" className="login-link">Recuperar la contrasenya</a>
        <div className="login-register">
          <span>No tens un compte?</span>
          <a href="/register" className="register-link">Crear-ne una</a>
        </div>
      </div>
    </div>
  )
}