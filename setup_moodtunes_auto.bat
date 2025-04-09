@echo off
echo ==============================
echo 🚀 Script d'instal·lació MoodTunes (Windows Avançat)
echo ==============================

:: Crear carpeta temporal de descàrregues
mkdir installers >nul 2>&1
cd installers

:: 1. Descarregar Node.js si no està instal·lat
where node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo 🔽 Descarregant Node.js LTS...
    powershell -Command "Invoke-WebRequest -Uri https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi -OutFile nodejs.msi"
    echo ▶️ Executant instal·lador de Node.js...
    start nodejs.msi
    pause
) ELSE (
    echo ✅ Node.js ja està instal·lat.
)

:: 2. Descarregar Docker Desktop si no està instal·lat
where docker >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo 🔽 Descarregant Docker Desktop...
    powershell -Command "Invoke-WebRequest -Uri https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe -OutFile docker_installer.exe"
    echo ▶️ Executant instal·lador de Docker...
    start docker_installer.exe
    pause
) ELSE (
    echo ✅ Docker ja està instal·lat.
)

cd ..

:: 3. Instal·lar dependències del frontend
echo.
echo 📦 Instal·lant dependències del frontend (React)...
cd web
call npm install
call npm install react-router-dom vite
cd ..

:: 4. Arrencar Docker (backend + BDD + phpMyAdmin)
echo.
echo 🐳 Arrencant serveis Docker...
cd docker
call docker compose up --build -d
cd ..

echo.
echo ✅ Entorn preparat correctament.
echo ▶️ Per iniciar el frontend: cd web && npm run dev
echo 🌐 phpMyAdmin disponible a: http://localhost:8080
pause
