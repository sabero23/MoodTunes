const express = require('express');
const router = express.Router();
const { crearPlaylist } = require('../controllers/playlistController');
const authenticateToken = require('../middleware/auth'); // ja està al teu projecte

// Ruta protegida per crear playlist
router.post('/', authenticateToken, crearPlaylist);

module.exports = router;
