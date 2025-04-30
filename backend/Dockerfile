# ----------------------------
# Dockerfile para el backend de MoodTunes
# Crea la imagen del servidor Node.js (Express)
# ----------------------------

# Usamos la imagen oficial de Node.js versión 18 (LTS recomendada para estabilidad)
FROM node:18

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias (package.json y package-lock.json si existe)
COPY package*.json ./

# Instalamos solo las dependencias necesarias para producción (no las de desarrollo)
RUN npm install --production

# Copiamos todo el código del proyecto al contenedor
COPY . .

# Exponemos el puerto 4000 (es el que utiliza el backend para escuchar las peticiones)
EXPOSE 4000

# Definimos el comando que arrancará el servidor al iniciar el contenedor
CMD ["npm", "start"]
