import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs';

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

// LOGIN
app.post('/login', async (req, res) => {
  const { email, contrasenya } = req.body
  try {
    const [rows] = await pool.query('SELECT contrasenya, rol FROM usuaris WHERE email = ?', [email])
    if (rows.length === 0) {
      return res.status(401).json({ ok: false, error: 'Credencials incorrectes' })
    }

    const valid = await bcrypt.compare(contrasenya, rows[0].contrasenya)
    if (valid) {
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
  const { email, nom, contrasenya, rol, data_naixement } = req.body
  try {
    const hash = await bcrypt.hash(contrasenya, 10)
    await pool.query(
      'INSERT INTO usuaris (email, nom, contrasenya, rol, data_naixement) VALUES (?, ?, ?, ?, ?)',
      [email, nom, hash, rol, data_naixement]
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

app.get('/', (req, res) => res.send('Backend MoodTunes OK'))

app.listen(4000, '0.0.0.0', () => console.log('Backend escoltant al port 4000'))
