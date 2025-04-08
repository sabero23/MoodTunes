import { useState } from 'react'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('standard')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!email.includes('@')) errs.email = 'Introdueix un correu vàlid.'
    if (password.length < 6) errs.password = 'Contrasenya massa curta.'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    alert(`Usuari registrat: ${email} (${role})`)
  }

  return (
    <div className="container mt-5">
      <h2>Registre</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" className="form-control my-2" placeholder="Correu"
               value={email} onChange={e => setEmail(e.target.value)} />
        {errors.email && <div className="text-danger">{errors.email}</div>}

        <input type="password" className="form-control my-2" placeholder="Contrasenya"
               value={password} onChange={e => setPassword(e.target.value)} />
        {errors.password && <div className="text-danger">{errors.password}</div>}

        <select className="form-control my-2" onChange={e => setRole(e.target.value)} value={role}>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
        </select>
        <button className="btn btn-success">Registrar</button>
      </form>
    </div>
  )
}
