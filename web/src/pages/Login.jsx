import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const validate = () => {
    const errs = {}
    if (!email.includes('@')) errs.email = 'El correu no és vàlid.'
    if (password.length < 6) errs.password = 'La contrasenya ha de tenir almenys 6 caràcters.'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Simulació de redirecció segons rol
    if (email === 'admin@moodtunes.com') navigate('/admin')
    else if (email === 'premium@moodtunes.com') navigate('/premium')
    else if (email === 'standard@moodtunes.com') navigate('/standard')
    else alert('Credencials incorrectes')
  }

  return (
    <div className="container mt-5">
      <h2>Iniciar sessió</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control my-2" type="email" placeholder="Correu"
          value={email} onChange={e => setEmail(e.target.value)} />
        {errors.email && <div className="text-danger">{errors.email}</div>}
        <input className="form-control my-2" type="password" placeholder="Contrasenya"
          value={password} onChange={e => setPassword(e.target.value)} />
        {errors.password && <div className="text-danger">{errors.password}</div>}
        <button className="btn btn-primary">Entrar</button>
      </form>

      <p className="mt-3">
        No tens compte? <a href="/register">Registra’t</a>
      </p>

    </div>
  )
}
