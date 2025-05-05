@echo off
echo =========================================
echo      Preparació entorn MoodTunes 🧩
echo =========================================

:: ===== COMPROVACIONS BÀSIQUES =====

echo.
:: Flutter
where flutter >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Flutter no està instal·lat. Ves a: https://docs.flutter.dev/get-started/install/windows
    exit /b
) ELSE (
    echo ✅ Flutter detectat!
    flutter --version
)

:: Android Studio
echo.
IF EXIST "%ProgramFiles%\Android\Android Studio\bin\studio64.exe" (
    echo ✅ Android Studio detectat!
) ELSE (
    echo ⚠️  Android Studio no detectat. Instal·la-ho: https://developer.android.com/studio
)

:: Visual Studio
echo.
IF EXIST "%ProgramFiles(x86)%\Microsoft Visual Studio\Installer\vswhere.exe" (
    "%ProgramFiles(x86)%\Microsoft Visual Studio\Installer\vswhere.exe" -products * -requires Microsoft.Component.MSBuild -property installationPath >nul 2>nul
    IF %ERRORLEVEL% EQU 0 (
        echo ✅ Visual Studio detectat!
    ) ELSE (
        echo ⚠️  Visual Studio detectat però pot faltar el component de compilació.
    )
) ELSE (
    echo ⚠️  Visual Studio no detectat. Instal·la-ho: https://visualstudio.microsoft.com/downloads/
)

:: Docker
echo.
where docker >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker no està instal·lat. Instal·la-ho: https://www.docker.com/products/docker-desktop/
    exit /b
) ELSE (
    echo ✅ Docker detectat!
)

:: Node.js
echo.
where node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js no està instal·lat. Instal·la-ho: https://nodejs.org/
    exit /b
) ELSE (
    echo ✅ Node.js detectat!
)

:: ===== CONFIGURACIÓ I ARRENCADA =====

echo.
:: FRONTEND - React + Vite
cd web
echo 📦 Instal·lant dependències React...
call npm install

echo 🔎 Comprovant react-icons...
call npm list react-icons >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ➕ Instal·lant react-icons...
    call npm install react-icons
) ELSE (
    echo ✅ react-icons ja està instal·lat.
)
cd ..

:: FLUTTER
cd app
echo 📦 flutter pub get...
call flutter pub get
cd ..

:: DOCKER
cd docker
echo 🐳 Aturant contenidors anteriors...
call docker compose down -v
echo 🛠️ Reconstruint i arrencant serveis...
start cmd /k "docker compose up --build"

cd ..

:: OBRIR WEB
timeout /t 10 >nul
echo 🌐 Obrint l'aplicació al navegador...
start http://localhost:5173

echo.
echo ✅ MoodTunes arrencat correctament!
echo 💡 Pots executar Flutter amb: cd app && flutter run
