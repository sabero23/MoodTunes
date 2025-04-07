import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    // TEMPORAL: validació dummy segons email
    if (email === 'admin@moodtunes.com') navigate('/admin')
    else if (email === 'premium@moodtunes.com') navigate('/premium')
    else if (email === 'standard@moodtunes.com') navigate('/standard')
    else alert('Credencials incorrectes')
  }

  return (
    <div className="container mt-5">
      <h2>Iniciar sessió</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" className="form-control my-2" placeholder="Correu" onChange={e => setEmail(e.target.value)} />
        <input type="password" className="form-control my-2" placeholder="Contrasenya" onChange={e => setPassword(e.target.value)} />
        <button className="btn btn-primary">Entrar</button>
      </form>
      <p className="mt-3">No tens compte? <a href="/register">Registra’t</a></p>
    </div>
  )
}
