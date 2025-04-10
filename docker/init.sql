
DROP TABLE IF EXISTS usuaris;

CREATE TABLE usuaris (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  nom VARCHAR(100) NOT NULL,
  contrasenya VARCHAR(100) NOT NULL,
  rol ENUM('standard', 'premium') DEFAULT 'standard',
  data_naixement DATE
);

-- Inserció d'usuari per defecte per provar (opcional)
INSERT INTO usuaris (email, nom, contrasenya, rol, data_naixement)
VALUES ('admin@moodtunes.com', 'Admin', '1234', 'premium', '2005-12-28');
