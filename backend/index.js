import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fetch from 'node-fetch';
import { authRequired, onlyRole } from './auth.js';
import { getSpotifyToken } from './spotify.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 🔌 Conexión a MySQL (pool de conexiones)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// 🟢 Ruta de prueba
app.get('/', (req, res) => res.send('Backend MoodTunes OK'));

// 🔐 LOGIN
app.post('/login', async (req, res) => {
  const { email, contrasenya } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM usuaris WHERE email = ?', [email]);
    if (rows.length === 1 && await bcrypt.compare(contrasenya, rows[0].contrasenya)) {
      const usuari = { email, rol: rows[0].rol, nom: rows[0].nom };
      const token = jwt.sign(usuari, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, ...usuari });
    } else {
      res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error en el login', detalles: err.message });
  }
});

// 📝 REGISTER
app.post('/register', async (req, res) => {
  const { email, nom, contrasenya, rol, data_naixement } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(contrasenya, 10);
    await pool.query(
      'INSERT INTO usuaris (email, nom, contrasenya, rol, data_naixement) VALUES (?, ?, ?, ?, ?)',
      [email, nom, hashedPassword, rol, data_naixement]
    );
    res.status(201).json({ ok: true, mensaje: 'Usuario registrado correctamente' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Ya existe un usuario con este correo' });
    } else {
      res.status(500).json({ error: 'Error en el registro', detalles: err.message });
    }
  }
});

// 🔐 Ruta protegida - Solo ADMIN
app.get('/admin-data', authRequired, onlyRole('admin'), (req, res) => {
  res.json({ mensaje: 'Datos protegidos para administradores' });
});

// 🔐 Ruta protegida - Solo PREMIUM
app.get('/premium-data', authRequired, onlyRole('premium'), (req, res) => {
  res.json({ mensaje: 'Datos protegidos para usuarios premium' });
});

// 🎵 AUTH SPOTIFY - Iniciar sesión con Spotify
app.get('/auth/spotify', async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: 'Email no proporcionado' });

  const scope = 'user-read-private user-read-email streaming user-modify-playback-state user-read-playback-state';
  const redirectUri = encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI);

  const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${scope}&redirect_uri=${redirectUri}&state=${email}`;
  res.redirect(url);
});

// 🎵 CALLBACK SPOTIFY - Guardar refresh_token
app.get('/callback', async (req, res) => {
  const { code, state: email } = req.query;

  if (!code || !email) {
    return res.status(400).send('Faltan parámetros en la solicitud');
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error_description });
    }

    await pool.query('UPDATE usuaris SET spotify_refresh_token = ? WHERE email = ?', [data.refresh_token, email]);
    res.redirect(`http://localhost:5173/redir?email=${email}`); // Redirige a una pantalla intermedia
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el token de Spotify', detalles: err.message });
  }
});

// 🔄 REFRESH TOKEN SPOTIFY
app.post('/spotify/refresh', async (req, res) => {
  const { refresh_token } = req.body;

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
      }),
    });

    const data = await response.json();
    if (data.error) {
      return res.status(400).json({ error: data.error_description });
    }

    res.json({
      access_token: data.access_token,
      expires_in: data.expires_in,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al renovar el token', detalles: err.message });
  }
});

// 🔁 TOKEN BACKEND SIN LOGIN
app.get('/spotify/token', async (req, res) => {
  try {
    const token = await getSpotifyToken();
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el token de Spotify', detalles: err.message });
  }
});

// 🔵 Comprobar si el usuario tiene refresh_token de Spotify (Nuevo endpoint)
app.get('/check-spotify', async (req, res) => {
  const email = req.query.email;
  
  if (!email) {
    return res.status(400).json({ error: 'Email no proporcionado' });
  }

  try {
    const [rows] = await pool.query('SELECT spotify_refresh_token, rol FROM usuaris WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const { spotify_refresh_token, rol } = rows[0];

    if (spotify_refresh_token) {
      res.json({ conectado: true, rol });
    } else {
      res.json({ conectado: false, rol });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al comprobar Spotify', detalles: err.message });
  }
});


// 🚀 Arranque del servidor
app.listen(4000, '0.0.0.0', () => console.log('Backend escuchando en el puerto 4000'));