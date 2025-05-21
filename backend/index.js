// index.js
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
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  user:     process.env.DB_USER,
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
    const hash = await bcrypt.hash(contrasenya, 10);
    await pool.query(
      'INSERT INTO usuaris (email, nom, contrasenya, rol, data_naixement) VALUES (?, ?, ?, ?, ?)',
      [email, nom, hash, rol, data_naixement]
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

// ────────────── RUTA DE INFORMACIÓN DEL USUARIO ──────────────

app.get('/usuarios/info', authRequired, async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await pool.query(
      'SELECT id, email, nom, rol, spotify_refresh_token FROM usuaris WHERE id = ?',
      [userId]
    );
    if (!rows.length) return res.status(404).json({ error: 'Usuari no trobat' });
    const u = rows[0];
    const token = jwt.sign(
      { id: u.id, email: u.email, rol: u.rol, nom: u.nom },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ ...u, token, necesitaSpotify: !u.spotify_refresh_token });
  } catch (err) {
    res.status(500).json({ error: 'Error en obtenir dades', detalles: err.message });
  }
});

// ────────────── OAUTH SPOTIFY ──────────────

app.get('/auth/spotify', (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: 'Email no proporcionado' });
  const scope = [
    'user-read-private', 'user-read-email',
    'streaming','user-modify-playback-state','user-read-playback-state',
    'user-top-read','user-read-recently-played'
  ].join(' ');
  const redirectUri = encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI);
  const url = `https://accounts.spotify.com/authorize` +
    `?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}` +
    `&scope=${scope}&redirect_uri=${redirectUri}` +
    `&state=${email}&show_dialog=true`;
  res.redirect(url);
});

app.get('/callback', async (req, res) => {
  const { code, state: email } = req.query;
  if (!code || !email) return res.status(400).send('Faltan parámetros');
  try {
    // intercambiar código por tokens
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' +
          Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    });
    const tokens = await tokenRes.json();
    if (tokens.error) return res.status(400).json({ error: tokens.error_description });

    // guardar refresh token y perfil
    const access_token  = tokens.access_token;
    const refresh_token = tokens.refresh_token;
    const profileRes = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    const perfil = await profileRes.json();

    await pool.query(
      `UPDATE usuaris
         SET spotify_refresh_token = ?, spotify_id = ?, spotify_nom = ?
       WHERE email = ?`,
      [refresh_token, perfil.id, perfil.display_name, email]
    );

    const [[{ rol }]] = await pool.query(
      'SELECT rol FROM usuaris WHERE email = ?',
      [email]
    );
    res.redirect(`http://localhost:5173/${rol}`);
  } catch (err) {
    res.status(500).json({ error: 'Error al conectar con Spotify', detalles: err.message });
  }
});

// ────────────── GUARDAR ESTADO ──────────────

app.post('/api/estat', authRequired, async (req, res) => {
  const userId = req.user.id;
  const { estat } = req.body;
  const opcions = [
    'muy_mal','mal','algo_mal','normal','bien','muy_bien','motivado'
  ];
  if (!opcions.includes(estat)) {
    return res.status(400).json({ error: 'Estat d’ànim no vàlid' });
  }
  try {
    await pool.query(
      'INSERT INTO estats_anim (user_id, estat) VALUES (?, ?)',
      [userId, estat]
    );
    res.json({ missatge: 'Estat d’ànim guardat correctament' });
  } catch (err) {
    res.status(500).json({ error: 'Error en guardar l’estat d’ànim', detalls: err.message });
  }
});

// ────────────── RECOMENDACIONES PERSONALIZADAS ──────────────

// función para barajar un array
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// buckets según audio-features
const moodBuckets = {
  muy_mal:  f => f.valence <= 0.2 && f.energy <= 0.2,
  mal:      f => f.valence <= 0.4 && f.energy <= 0.4,
  algo_mal: f => f.valence <= 0.5,
  normal:   f => f.valence > 0.4 && f.valence <= 0.6,
  bien:     f => f.valence >= 0.6 && f.energy >= 0.5,
  muy_bien: f => f.valence >= 0.8 && f.energy >= 0.7,
  motivado: f => f.energy >= 0.7 && f.tempo >= 100
};

app.get('/api/recomanacions', authRequired, async (req, res) => {
  const userId = req.user.id;
  try {
    // 1) Último mood y límite según rol
    const [[{ estat }]] = await pool.query(
      'SELECT estat FROM estats_anim WHERE user_id = ? ORDER BY `data` DESC LIMIT 1',
      [userId]
    );
    const limit = req.user.rol === 'premium' ? 3 : 1;

    // 2) Ya recomendadas hoy
    const today = new Date().toISOString().slice(0,10);
    const [oldRows] = await pool.query(
      `SELECT canco_id FROM recomanacions
         WHERE user_id=? AND estat_anim=? AND DATE(data)=?`,
      [userId, estat, today]
    );
    const seen = oldRows.map(r => r.canco_id);

    // 3) Semillas y token
    const token = await getSpotifyTokenPerUsuari(userId);
    let seeds = [];
    try {
      seeds = (await getTopTracks(token)).slice(0,5);
    } catch {
      seeds = (await getTopArtists(token)).slice(0,5);
    }
    if (!seeds.length) throw new Error('Sin semillas');

    // 4) Intento Recommendations
    let tracks = [];
    try {
      const url = `https://api.spotify.com/v1/recommendations`
                + `?limit=${limit*2}&market=ES`
                + `&seed_tracks=${seeds.join(',')}`;
      const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (r.ok) {
        const js = await r.json();
        tracks = js.tracks || [];
      }
    } catch (err) {
      console.warn('▸ reco error', err.message);
    }

    // 5) Filtrar duplicados y recortar a `limit`
    let uniques = tracks.filter(t => !seen.includes(t.id)).slice(0, limit);
    if (uniques.length < limit) {
      uniques = tracks.slice(0, limit);
    }

    // 6) Fallback search si no hay `uniques`
    if (!uniques.length) {
      const moodToGenre = {
        muy_mal: 'sad', mal: 'emo', algo_mal: 'acoustic',
        normal: 'pop', bien: 'dance', muy_bien: 'happy',
        motivado: 'work-out'
      };
      const genre = moodToGenre[estat] || 'pop';
      const searchUrl = `https://api.spotify.com/v1/search`
                      + `?limit=${limit}&market=ES&type=track&q=genre:${genre}`;
      const sr = await fetch(searchUrl, { headers: { Authorization: `Bearer ${token}` } });
      if (!sr.ok) throw new Error(`Search Spotify ${sr.status}`);
      const sj = await sr.json();
      uniques = (sj.tracks.items||[]).slice(0, limit);
    }

    // 7) Guardar en BD y formatear salida **incluyendo preview_url**
    const salida = [];
    for (const t of uniques) {
      await pool.query(
        `INSERT INTO recomanacions
           (user_id, estat_anim, canco_id, nom_canco, artista)
         VALUES (?,?,?,?,?)`,
        [userId, estat, t.id, t.name, t.artists[0]?.name || 'Desconocido']
      );
      salida.push({
        id:      t.id,
        name:    t.name,
        artist:  t.artists[0]?.name || 'Desconocido',
        image:   t.album.images[0]?.url  || '',
        uri:     t.uri,               // para deep-link a Spotify si quieres
        preview: t.preview_url        // aquí está la preview de 30s
      });
    }
    res.json({ recomanacions: salida });
  } catch (err) {
    console.error('💥 /api/recomanacions fallo:', err);
    res.status(500).json({
      error: 'No se pudieron obtener recomendaciones',
      detalles: err.message
    });
  }
});
// ────────────────────────────────────────────────────────────────────────────────

app.listen(4000, '0.0.0.0', () =>
  console.log('✅ Backend escoltant al port 4000')
);