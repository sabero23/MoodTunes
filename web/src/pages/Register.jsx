import { useState } from 'react'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('standard')

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Usuari registrat: ${email} (${role})`)
  }

  return (
    <div className="container mt-5">
      <h2>Registre</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" className="form-control my-2" placeholder="Correu" onChange={e => setEmail(e.target.value)} />
        <input type="password" className="form-control my-2" placeholder="Contrasenya" onChange={e => setPassword(e.target.value)} />
        <select className="form-control my-2" onChange={e => setRole(e.target.value)} value={role}>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
        </select>
        <button className="btn btn-success">Registrar</button>
      </form>
    </div>
  )
}
