-- Eliminamos las tablas si ya existen para evitar conflictos en cada reinicio del contenedor.
DROP TABLE IF EXISTS recomanacions;
DROP TABLE IF EXISTS estats_anim;
DROP TABLE IF EXISTS usuaris;

-- Tabla 'usuaris':
-- Guarda la información de cada usuario, incluyendo el token de refresh de Spotify si lo usa.
CREATE TABLE usuaris (
  email VARCHAR(100) PRIMARY KEY,                              -- Correo del usuario, clave primaria.
  nom VARCHAR(100) NOT NULL,                                   -- Nombre del usuario.
  contrasenya VARCHAR(100) NOT NULL,                           -- Contraseña encriptada (bcrypt).
  rol ENUM('standard', 'premium', 'admin') DEFAULT 'standard', -- Tipo de rol del usuario.
  data_naixement DATE,                                         -- Fecha de nacimiento.
  spotify_refresh_token VARCHAR(255),                          -- Token de refresh de Spotify (si aplica).
  spotify_id VARCHAR(100),
  spotify_nom VARCHAR(255)

);

-- Insertamos un usuario administrador por defecto.
INSERT INTO usuaris (email, nom, contrasenya, rol, data_naixement)
VALUES (
  'admin@moodtunes.com',
  'Admin',
  '$2b$12$7qDKiQjKSsni9Qzi6vd7AOhS/QaC2xJOMIFC3Lu4HhnLlYZ5G8YJW',
  'admin',
  '2005-12-28'
);

-- Insertamos usuario STANDARD
INSERT INTO usuaris (email, nom, contrasenya, rol, data_naixement)
VALUES (
  'standard@moodtunes.com',
  'Usuari Standard',
  '$2a$10$GXQPPhoGyk.xLY.O69BN3egVrcWfH.K8ZsWUcgPz1NOFe1WZUiiIy',
  'standard',
  '2000-01-01'
);

-- Insertamos usuario PREMIUM
INSERT INTO usuaris (email, nom, contrasenya, rol, data_naixement)
VALUES (
  'premium@moodtunes.com',
  'Usuari Premium',
  '$2a$10$GXQPPhoGyk.xLY.O69BN3egVrcWfH.K8ZsWUcgPz1NOFe1WZUiiIy',
  'premium',
  '1995-05-15'
);

-- Tabla 'estats_anim':
CREATE TABLE estats_anim (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100),
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estat ENUM('molt malament', 'malament', 'regular', 'bé', 'molt bé'),
  FOREIGN KEY (email) REFERENCES usuaris(email) ON DELETE CASCADE
);

-- Tabla 'recomanacions':
CREATE TABLE recomanacions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100),
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estat_anim ENUM('molt malament', 'malament', 'regular', 'bé', 'molt bé'),
  canco_id VARCHAR(100),
  nom_canco VARCHAR(255),
  artista VARCHAR(255),
  FOREIGN KEY (email) REFERENCES usuaris(email) ON DELETE CASCADE
);
