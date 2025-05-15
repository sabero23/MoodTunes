// spotify.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

// Conexión a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/**
 * Renueva el access_token de Spotify para un usuario según su ID
 * @param {number} userId - ID del usuario en la BBDD
 * @returns {Promise<string>} access_token válido
 */
export async function getSpotifyTokenPerUsuari(userId) {
  const [rows] = await pool.query(
    'SELECT spotify_refresh_token FROM usuaris WHERE id = ?',
    [userId]
  );

  if (!rows.length || !rows[0].spotify_refresh_token) {
    throw new Error('Usuari sense refresh token');
  }

  const refresh_token = rows[0].spotify_refresh_token;

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    }),
  });

  const raw = await response.text(); // Para depurar mejor
  try {
    const data = JSON.parse(raw);
    if (!data.access_token) {
      console.error('Error al renovar token:', data);
      throw new Error('No access_token en la respuesta de Spotify');
    }

    return data.access_token;
  } catch (e) {
    console.error(' No es JSON válido:', e);
    console.error('Spotify RAW Response:', raw);
    throw new Error('Respuesta no válida de Spotify');
  }
}
