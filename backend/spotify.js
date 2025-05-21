// spotify.js - Gestión de tokens y datos de Spotify
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
 * Obtiene un token de acceso Spotify usando el refresh_token guardado para el usuario
 */
export async function getSpotifyTokenPerUsuari(userId) {
  const [rows] = await pool.query(
    'SELECT spotify_refresh_token FROM usuaris WHERE id = ?',
    [userId]
  );

  if (!rows.length || !rows[0].spotify_refresh_token) {
    throw new Error('Usuario sin refresh token de Spotify');
  }

  const refresh_token = rows[0].spotify_refresh_token;
  const basicAuth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Error renovando token Spotify (status ' + response.status + '):', errorBody);
    throw new Error('Error renovando token de Spotify');
  }

  const data = await response.json();
  const { access_token } = data;
  if (!access_token) {
    console.error('❌ Datos inválidos al renovar token:', data);
    throw new Error('No se pudo obtener el access token');
  }

  return access_token;
}

/**
 * Obtiene los top artistas del usuario para usar como semilla en recomendaciones
 */
export async function getTopArtists(access_token) {
  const url = 'https://api.spotify.com/v1/me/top/artists?limit=5&time_range=medium_term';
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Error obteniendo top artists (status ${response.status}):`, errorBody);
    throw new Error('No se pudieron obtener los artistas top');
  }

  const data = await response.json();
  if (!Array.isArray(data.items)) {
    console.error('❌ Formato inesperado en top artists:', data);
    throw new Error('Formato inesperado de datos de Spotify');
  }

  // Extraemos IDs y devolvemos hasta 5
  const artistIds = data.items.map((artist) => artist.id).slice(0, 5);
  return artistIds;
}

/**
 * Obtiene las top tracks del usuario para usar como semilla
 */
export async function getTopTracks(access_token) {
  const url = 'https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=medium_term';
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${access_token}` }
  });
  if (!response.ok) {
    const txt = await response.text();
    console.error('Error obteniendo top tracks:', response.status, txt);
    throw new Error('No se pudieron obtener las top tracks');
  }
  const { items } = await response.json();
  return items.map(t => t.id).slice(0, 5);
}
