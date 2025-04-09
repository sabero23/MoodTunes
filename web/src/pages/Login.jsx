import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
        // Redirigeix segons el rol
        navigate(`/${data.rol}`)
      } else {
        setError(data.error || 'Error de connexió')
      }
    } catch (err) {
      setError('No s’ha pogut connectar amb el servidor')
    }
  }

  return (
    <div className="container mt-5">
      <h2>Iniciar sessió</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" className="form-control my-2" placeholder="Correu"
          value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" className="form-control my-2" placeholder="Contrasenya"
          value={contrasenya} onChange={e => setContrasenya(e.target.value)} />
        {error && <div className="text-danger">{error}</div>}
        <button className="btn btn-primary">Entrar</button>
      </form>
      <p className="mt-3">
        Encara no tens compte? <a href="/register">Registra't</a>
      </p>

    </div>
  )
}
