import { useState } from 'react'

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    nom: '',
    contrasenya: '',
    rol: 'standard'
  })
  const [missatge, setMissatge] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMissatge('')
    setError('')

    try {
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await resposta.json()

      if (resposta.ok) {
        setMissatge(data.missatge)
      } else {
        setError(data.error || 'Error durant el registre')
      }
    } catch (err) {
      setError('Error de connexió amb el servidor')
    }
  }

  return (
    <div className="container mt-5">
      <h2>Registrar-se</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" className="form-control my-2" placeholder="Correu"
          value={form.email} onChange={handleChange} />
        <input name="nom" type="text" className="form-control my-2" placeholder="Nom"
          value={form.nom} onChange={handleChange} />
        <input name="contrasenya" type="password" className="form-control my-2" placeholder="Contrasenya"
          value={form.contrasenya} onChange={handleChange} />
        <select name="rol" className="form-control my-2" value={form.rol} onChange={handleChange}>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
        </select>
        {missatge && <div className="text-success">{missatge}</div>}
        {error && <div className="text-danger">{error}</div>}
        <button className="btn btn-success">Registrar</button>
      </form>
    </div>
  )
}
