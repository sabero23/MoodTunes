import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

// Connexió a MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

// Ruta test
app.get('/', (req, res) => res.send('Backend MoodTunes OK'))

// LOGIN
app.post('/login', async (req, res) => {
  const { email, contrasenya } = req.body
  try {
    const [rows] = await pool.query(
      'SELECT rol FROM usuaris WHERE email = ? AND contrasenya = ?',
      [email, contrasenya]
    )
    if (rows.length === 1) {
      res.json({ ok: true, rol: rows[0].rol })
    } else {
      res.status(401).json({ ok: false, error: 'Credencials incorrectes' })
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al fer login', detalls: err.message })
  }
})

// REGISTER
app.post('/register', async (req, res) => {
  const { email, nom, contrasenya, rol } = req.body
  try {
    await pool.query(
      'INSERT INTO usuaris (email, nom, contrasenya, rol) VALUES (?, ?, ?, ?)',
      [email, nom, contrasenya, rol]
    )
    res.status(201).json({ ok: true, missatge: 'Usuari registrat correctament' })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ ok: false, error: 'Ja existeix un usuari amb aquest correu' })
    } else {
      res.status(500).json({ error: 'Error al registrar', detalls: err.message })
    }
  }
})

app.listen(4000, '0.0.0.0', () => console.log('Backend escoltant al port 4000'))

