const db = require('../db');

// Crear una nova playlist
const crearPlaylist = (req, res) => {
  const { nom, descripcio } = req.body;
  const userId = req.user.id; // ve del token JWT

  if (!nom) return res.status(400).json({ missatge: 'El nom és obligatori.' });

  const sql = 'INSERT INTO playlists (user_id, nom, descripcio) VALUES (?, ?, ?)';
  db.query(sql, [userId, nom, descripcio], (err, result) => {
    if (err) {
      console.error('Error creant playlist:', err);
      return res.status(500).json({ missatge: 'Error intern del servidor.' });
    }
    res.status(201).json({ missatge: 'Playlist creada!', id: result.insertId });
  });
};

module.exports = { crearPlaylist };
