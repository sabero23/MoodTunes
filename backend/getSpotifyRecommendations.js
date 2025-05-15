import fetch from 'node-fetch';
import { getSpotifyTokenPerUsuari } from './spotify.js';

/**
 * Genera recomanacions de Spotify segons l'estat d'ànim de l'usuari.
 * @param {object} usuari - Informació de l'usuari { id, rol }
 * @param {string} estat - Estat d'ànim seleccionat
 * @returns {Promise<Array>} Array de cançons recomanades
 */
export async function getSpotifyRecommendations(usuari, estat) {
  const accessToken = await getSpotifyTokenPerUsuari(usuari.id);
  if (!accessToken) throw new Error('No s\'ha pogut obtenir el token de Spotify');

  // Definim gèneres segons estat d'ànim
  const estatToGenres = {
    "molt malament": ["sad", "acoustic", "piano"],
    "malament": ["low-fi", "indie", "ambient"],
    "regular": ["pop", "alt-rock", "indie"],
    "bé": ["dance", "pop", "electronic"],
    "molt bé": ["party", "happy", "funk"],
  };

  const seedGenres = estatToGenres[estat] || ["pop"];
  const limit = usuari.rol === "premium" ? 10 : 3;

  const url = `https://api.spotify.com/v1/recommendations?limit=${limit}&seed_genres=${seedGenres.join(",")}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!data.tracks) {
    console.error("Spotify error:", data);
    throw new Error("No s'han pogut obtenir recomanacions");
  }

  // Retornem només les dades essencials
  return data.tracks.map(track => ({
    canco_id: track.id,
    nom_canco: track.name,
    artista: track.artists.map(a => a.name).join(', '),
    url: track.external_urls.spotify,
    imatge: track.album.images[0]?.url || null
  }));
}
