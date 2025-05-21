// ✅ index.js complet i definitiu

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fetch from 'node-fetch';
import { authRequired, onlyRole } from './auth.js';
import { getSpotifyTokenPerUsuari, getTopArtists, getTopTracks } from './spotify.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.get('/', (req, res) => res.send('Backend MoodTunes OK'));

app.post('/login', async (req, res) => {
  const { email, contrasenya } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM usuaris WHERE email = ?', [email]);
    if (rows.length === 1 && await bcrypt.compare(contrasenya, rows[0].contrasenya)) {
      const usuari = { id: rows[0].id, email, rol: rows[0].rol, nom: rows[0].nom };
      const token = jwt.sign(usuari, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, ...usuari });
    } else {
      res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error en el login', detalles: err.message });
  }
});

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

app.get('/usuarios/info', authRequired, async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await pool.query('SELECT id, email, nom, rol, spotify_refresh_token FROM usuaris WHERE id = ?', [userId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Usuari no trobat' });

    const token = jwt.sign({ id: rows[0].id, email: rows[0].email, rol: rows[0].rol, nom: rows[0].nom }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const necesitaSpotify = !rows[0].spotify_refresh_token;
    res.json({ ...rows[0], token, necesitaSpotify });
  } catch (err) {
    res.status(500).json({ error: 'Error en obtenir dades', detalles: err.message });
  }
});

app.get('/auth/spotify', (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: 'Email no proporcionado' });

  const scope = 'user-read-private user-read-email streaming user-modify-playback-state user-read-playback-state user-top-read';
  const redirectUri = encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI);
  const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${scope}&redirect_uri=${redirectUri}&state=${email}&show_dialog=true`;
  res.redirect(url);
});

app.get('/callback', async (req, res) => {
  const { code, state: email } = req.query;
  if (!code || !email) return res.status(400).send('Faltan parámetros');

  try {
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenRes.json();
    if (tokens.error) return res.status(400).json({ error: tokens.error_description });

    const access_token = tokens.access_token;
    const refresh_token = tokens.refresh_token;

    const profileRes = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const perfil = await profileRes.json();

    await pool.query(
      `UPDATE usuaris SET spotify_refresh_token = ?, spotify_id = ?, spotify_nom = ? WHERE email = ?`,
      [refresh_token, perfil.id, perfil.display_name, email]
    );

    const [rows] = await pool.query("SELECT rol FROM usuaris WHERE email = ?", [email]);
    const rol = rows.length ? rows[0].rol : 'login';
    res.redirect(`http://localhost:5173/${rol}`);
  } catch (err) {
    res.status(500).json({ error: 'Error al conectar con Spotify', detalles: err.message });
  }
});

app.post('/api/estat', authRequired, async (req, res) => {
  const userId = req.user.id;
  const { estat } = req.body;
  const opcions = ["muy_mal", "mal", "algo_mal", "normal", "bien", "muy_bien", "motivado"];
  if (!opcions.includes(estat)) return res.status(400).json({ error: "Estat d’ànim no vàlid" });

  try {
    await pool.query("INSERT INTO estats_anim (user_id, estat) VALUES (?, ?)", [userId, estat]);
    res.status(200).json({ missatge: "Estat d’ànim guardat correctament" });
  } catch (err) {
    res.status(500).json({ error: "Error en guardar l’estat d’ànim", detalls: err.message });
  }
});

app.get('/api/recomanacions', authRequired, async (req, res) => {
  const userId = req.user.id;
  try {
    // 1) Último mood
    const [[{ estat }]] = await pool.query(
      'SELECT estat FROM estats_anim WHERE user_id = ? ORDER BY `data` DESC LIMIT 1',
      [userId]
    );
    const limit = req.user.rol === 'premium' ? 10 : 3;

    // 2) Token Spotify
    const access_token = await getSpotifyTokenPerUsuari(userId);

    // 3) Semillas: pistas, o artistas si no hay pistas
    let seeds = [];
    try {
      seeds = (await getTopTracks(access_token)).slice(0, 5);
    } catch {
      seeds = (await getTopArtists(access_token)).slice(0, 5);
    }
    if (!seeds.length) throw new Error('Sin semillas de usuario');

    // 4) Filtros de audio según mood
    const moodToAudio = {
      muy_mal:  { max_valence: 0.2, max_energy: 0.2 },
      mal:      { max_valence: 0.3, max_energy: 0.4 },
      algo_mal: { max_valence: 0.4, max_energy: 0.5 },
      normal:   { min_valence: 0.4, max_valence: 0.6 },
      bien:     { min_valence: 0.6, min_energy: 0.5 },
      muy_bien: { min_valence: 0.8, min_energy: 0.6 },
      motivado: { min_energy: 0.7, min_tempo: 100 },
    };
    const audioParams = moodToAudio[estat] || {};
    const featureString = Object.entries(audioParams)
      .map(([k,v]) => `&${k}=${v}`)
      .join('');

    // 5) Construcción URL
    const market = 'ES';
    const seedKey = seeds === await getTopTracks(access_token) ? 'seed_tracks' : 'seed_artists';
    const url = `https://api.spotify.com/v1/recommendations?limit=${limit}&market=${market}&${seedKey}=${seeds.join(',')}${featureString}`;

    console.log('🔎 Llamando a Spotify:', url);
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${access_token}` } });
    const raw = await resp.text();

    if (resp.ok) {
      const { tracks } = JSON.parse(raw);
      if (tracks.length) {
        // Guardamos en BD SIN created_at
        for (const t of tracks) {
          await pool.query(
            `INSERT INTO recomanacions 
               (user_id, estat_anim, canco_id, nom_canco, artista) 
             VALUES (?, ?, ?, ?, ?)`,
            [userId, estat, t.id, t.name, t.artists[0]?.name || 'Desconocido']
          );
        }
        return res.json({ recomanacions: tracks });
      }
    }
    console.warn('❌ Recommendations falló o sin tracks:', resp.status, raw);

    // 6) Fallback a Search por género
    const moodToGenre = {
      muy_mal:  'sad',
      mal:      'emo',
      algo_mal: 'acoustic',
      normal:   'pop',
      bien:     'dance',
      muy_bien: 'happy',
      motivado: 'work-out',
    };
    const genre = moodToGenre[estat] || 'pop';
    const searchUrl = `https://api.spotify.com/v1/search?limit=${limit}&market=${market}&type=track&q=genre:${genre}`;
    console.log('🔎 Fallback Search →', searchUrl);
    const sResp = await fetch(searchUrl, { headers: { Authorization: `Bearer ${access_token}` } });
    const sRaw = await sResp.text();
    if (sResp.ok) {
      const { tracks } = JSON.parse(sRaw);
      for (const item of tracks.items.slice(0, limit)) {
        await pool.query(
          `INSERT INTO recomanacions 
             (user_id, estat_anim, canco_id, nom_canco, artista) 
           VALUES (?, ?, ?, ?, ?)`,
          [userId, estat, item.id, item.name, item.artists[0]?.name || 'Desconocido']
        );
      }
      return res.json({ recomanacions: tracks.items });
    }
    console.error('🚨 Search falló también:', sResp.status, sRaw);
    throw new Error(`Search Spotify ${sResp.status}`);
  } catch (err) {
    console.error('🔴 Error en /api/recomanacions:', err);
    res.status(500).json({
      error: 'No se pudieron obtener recomendaciones',
      detalles: err.message
    });
  }
});


app.listen(4000, '0.0.0.0', () => console.log('✅ Backend escoltant al port 4000'));