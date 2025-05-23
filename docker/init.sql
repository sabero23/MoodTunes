-- Eliminem les taules si existeixen
DROP TABLE IF EXISTS playlist_items;
DROP TABLE IF EXISTS recomanacions;
DROP TABLE IF EXISTS estats_anim;
DROP TABLE IF EXISTS playlists;
DROP TABLE IF EXISTS usuaris;

-- Taula 'usuaris'
CREATE TABLE usuaris (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  nom VARCHAR(100) NOT NULL,
  contrasenya VARCHAR(100) NOT NULL,
  rol ENUM('standard', 'premium', 'admin') DEFAULT 'standard',
  data_naixement DATE,
  spotify_refresh_token VARCHAR(255),
  spotify_id VARCHAR(100),
  spotify_nom VARCHAR(255)
);

-- Insercions d'usuaris d'exemple
INSERT INTO usuaris (email, nom, contrasenya, rol, data_naixement) VALUES
('admin@moodtunes.com', 'Admin', '$2b$12$7qDKiQjKSsni9Qzi6vd7AOhS/QaC2xJOMIFC3Lu4HhnLlYZ5G8YJW', 'admin', '2005-12-28'),
('standard@moodtunes.com', 'Usuari Standard', '$2a$10$GXQPPhoGyk.xLY.O69BN3egVrcWfH.K8ZsWUcgPz1NOFe1WZUiiIy', 'standard', '2000-01-01'),
('premium@moodtunes.com', 'Usuari Premium', '$2a$10$GXQPPhoGyk.xLY.O69BN3egVrcWfH.K8ZsWUcgPz1NOFe1WZUiiIy', 'premium', '1995-05-15');

-- Taula 'estats_anim'
CREATE TABLE estats_anim (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estat ENUM('muy_mal', 'mal', 'algo_mal', 'normal', 'bien', 'muy_bien', 'motivado'),
  FOREIGN KEY (user_id) REFERENCES usuaris(id) ON DELETE CASCADE
);

-- Taula 'playlists'
CREATE TABLE playlists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  nom VARCHAR(100) NOT NULL,
  descripcio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usuaris(id) ON DELETE CASCADE
);

-- Taula 'recomanacions'
CREATE TABLE recomanacions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estat_anim ENUM('muy_mal', 'mal', 'algo_mal', 'normal', 'bien', 'muy_bien', 'motivado'),
  canco_id VARCHAR(100),
  nom_canco VARCHAR(255),
  artista VARCHAR(255),
  preview VARCHAR(255),
  image VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES usuaris(id) ON DELETE CASCADE
);

-- Taula per relacionar playlists amb cançons
CREATE TABLE playlist_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  playlist_id INT NOT NULL,
  canco_id VARCHAR(100) NOT NULL,
  nom_canco VARCHAR(255),
  artista VARCHAR(255),
  preview VARCHAR(255),
  image VARCHAR(255),
  inserted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE
);
