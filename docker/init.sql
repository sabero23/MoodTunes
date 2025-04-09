CREATE TABLE IF NOT EXISTS usuaris (
  email VARCHAR(100) PRIMARY KEY,
  nom VARCHAR(100),
  contrasenya VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'standard', 'premium') DEFAULT 'standard',
  creat_el TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuaris (email, nom, contrasenya, rol)
VALUES ('admin@moodtunes.com', 'Admin', 'DieSam2025!', 'admin')
ON DUPLICATE KEY UPDATE email=email;
