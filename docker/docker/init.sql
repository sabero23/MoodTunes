CREATE TABLE IF NOT EXISTS usuari (
  email VARCHAR(100) PRIMARY KEY,
  nom VARCHAR(100),
  contrasenya VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'standard', 'premium') DEFAULT 'standard',
  creat_el TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear usuari admin per defecte (contrasenya hash dummy per ara)
INSERT INTO usuari (email, nom, contrasenya, rol)
VALUES ('admin@moodtunes.com', 'Admin', 'admin123', 'admin')
ON DUPLICATE KEY UPDATE email=email;
