import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs' // ✅ Usar bcryptjs per compatibilitat
import { authRequired, onlyRole } from './auth.js'

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
      'SELECT * FROM usuaris WHERE email = ?',
      [email]
    )

    if (rows.length === 1 && await bcrypt.compare(contrasenya, rows[0].contrasenya)) {
      const usuari = { email, rol: rows[0].rol, nom: rows[0].nom }
      const token = jwt.sign(usuari, process.env.JWT_SECRET, { expiresIn: '1h' })
      res.json({ token, ...usuari })
    } else {
      res.status(401).json({ error: 'Credencials incorrectes' })
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al fer login', detalls: err.message })
  }
})

// REGISTER
app.post('/register', async (req, res) => {
  const { email, nom, contrasenya, rol, data_naixement } = req.body
  try {
    const hashedPassword = await bcrypt.hash(contrasenya, 10)
    await pool.query(
      'INSERT INTO usuaris (email, nom, contrasenya, rol, data_naixement) VALUES (?, ?, ?, ?, ?)',
      [email, nom, hashedPassword, rol, data_naixement]
    )
    res.status(201).json({ ok: true, missatge: 'Usuari registrat correctament' })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Ja existeix un usuari amb aquest correu' })
    } else {
      res.status(500).json({ error: 'Error al registrar', detalls: err.message })
    }
  }
})

// RUTES PROTEGIDES
app.get('/admin-data', authRequired, onlyRole('admin'), (req, res) => {
  res.json({ missatge: 'Dades protegides per a Admins' })
})

app.get('/premium-data', authRequired, onlyRole('premium'), (req, res) => {
  res.json({ missatge: 'Dades protegides per a Premiums' })
})

app.listen(4000, '0.0.0.0', () => console.log('Backend escoltant al port 4000'))
