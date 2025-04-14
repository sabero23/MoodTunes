DROP TABLE IF EXISTS usuaris;

CREATE TABLE usuaris (
  email VARCHAR(100) NOT NULL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  contrasenya VARCHAR(100) NOT NULL,
  rol ENUM('standard', 'premium', 'admin') DEFAULT 'standard',
  data_naixement DATE
);

-- Inserció d'usuari per defecte amb contrasenya encriptada (bcrypt)
INSERT INTO usuaris (email, nom, contrasenya, rol, data_naixement)
VALUES (
  'admin@moodtunes.com',
  'Admin',
  '$2b$12$7qDKiQjKSsni9Qzi6vd7AOhS/QaC2xJOMIFC3Lu4HhnLlYZ5G8YJW',
  'admin',
  '2005-12-28'
);
