import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'

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

app.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() as hora')
    res.json({ status: 'ok', hora: rows[0].hora })
  } catch (err) {
    res.status(500).json({ error: 'Error de connexió a la base de dades' })
  }
})

app.listen(4000, () => console.log('✅ Backend escoltant al port 4000'))
