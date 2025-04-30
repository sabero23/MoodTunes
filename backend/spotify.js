// --------------------------------------------
// Integración con Spotify (Client Credentials)
// --------------------------------------------
// Este módulo obtiene un token de acceso desde Spotify utilizando el flow de
// "Client Credentials" (para acceder a la API sin que el usuario haga login).
// El token se cachea para evitar solicitudes innecesarias mientras siga vigente.

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Cache del token para evitar peticiones repetidas si el token aún no ha expirado.
let tokenCache = { token: null, expires: null };

/**
 * Función para obtener el token de acceso de Spotify usando el flow client_credentials.
 * Si el token está cacheado y no ha expirado, se devuelve directamente.
 * Si no, se hace la petición a Spotify para obtener uno nuevo.
 *
 * @returns {Promise<string>} Token de acceso válido para la API de Spotify.
 */
export async function getSpotifyToken() {
  const now = Date.now();

  // Si el token sigue siendo válido, lo devolvemos desde cache.
  if (tokenCache.token && tokenCache.expires > now) {
    return tokenCache.token;
  }

  // Si no hay token válido, pedimos uno nuevo a Spotify.
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({ grant_type: 'client_credentials' }), // Tipo de grant para obtener el token sin login de usuario.
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64'), // Autenticación con client_id y client_secret.
      },
    }
  );

  // Actualizamos la cache con el nuevo token y su tiempo de expiración.
  tokenCache = {
    token: response.data.access_token,
    expires: now + response.data.expires_in * 1000, // expires_in viene en segundos, lo pasamos a milisegundos.
  };

  return tokenCache.token;
}
