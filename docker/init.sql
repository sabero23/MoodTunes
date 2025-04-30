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
  spotify_refresh_token VARCHAR(255)                           -- Token de refresh de Spotify (si aplica).
);

-- Insertamos un usuario administrador por defecto.
-- La contraseña ya está encriptada con bcrypt (hash).
INSERT INTO usuaris (email, nom, contrasenya, rol, data_naixement)
VALUES (
  'admin@moodtunes.com',
  'Admin',
  '$2b$12$7qDKiQjKSsni9Qzi6vd7AOhS/QaC2xJOMIFC3Lu4HhnLlYZ5G8YJW', -- hash bcrypt
  'admin',
  '2005-12-28'
);

-- Tabla 'estats_anim':
-- Guarda los registros del estado de ánimo introducido por cada usuario.
CREATE TABLE estats_anim (
  id INT AUTO_INCREMENT PRIMARY KEY,                                      -- ID autoincremental.
  email VARCHAR(100),                                                     -- Usuario que registra el estado.
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,                               -- Fecha y hora de registro.
  estat ENUM('molt malament', 'malament', 'regular', 'bé', 'molt bé'),    -- Estado de ánimo.
  FOREIGN KEY (email) REFERENCES usuaris(email) ON DELETE CASCADE         -- Relación con tabla usuaris.
);

-- Tabla 'recomanacions':
-- Guarda las canciones recomendadas al usuario según su estado de ánimo.
CREATE TABLE recomanacions (
  id INT AUTO_INCREMENT PRIMARY KEY,                                        -- ID autoincremental.
  email VARCHAR(100),                                                       -- Usuario al que se le recomienda.
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,                                 -- Fecha de recomendación.
  estat_anim ENUM('molt malament', 'malament', 'regular', 'bé', 'molt bé'), -- Estado de ánimo en ese momento.
  canco_id VARCHAR(100),                                                    -- ID de la canción (Spotify).
  nom_canco VARCHAR(255),                                                   -- Nombre de la canción.
  artista VARCHAR(255),                                                     -- Nombre del artista.
  FOREIGN KEY (email) REFERENCES usuaris(email) ON DELETE CASCADE           -- Relación con tabla usuaris.
);
