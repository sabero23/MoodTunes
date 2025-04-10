@echo off
echo ===============================
echo Preparació entorn MoodTunes 🧩
echo ===============================

:: ==== COMPROVACIONS ====

:: Flutter
echo.
where flutter >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Flutter no està instal·lat. Ves a https://docs.flutter.dev/get-started/install/windows
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
    echo ⚠️  Android Studio no detectat. Pots instal·lar-lo des de:
    echo https://developer.android.com/studio
)

:: Visual Studio
echo.
IF EXIST "%ProgramFiles(x86)%\Microsoft Visual Studio\Installer\vswhere.exe" (
    "%ProgramFiles(x86)%\Microsoft Visual Studio\Installer\vswhere.exe" -products * -requires Microsoft.Component.MSBuild -property installationPath >nul 2>nul
    IF %ERRORLEVEL% EQU 0 (
        echo ✅ Visual Studio detectat
    ) ELSE (
        echo ⚠️  Visual Studio detectat però pot faltar C++
    )
) ELSE (
    echo ⚠️  Visual Studio no detectat. Instal·la-ho des de:
    echo https://visualstudio.microsoft.com/downloads/
)

:: Docker
echo.
where docker >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker no està instal·lat. Descarrega-ho: https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe
    exit /b
) ELSE (
    echo ✅ Docker detectat
)

:: Node.js
echo.
where node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js no està instal·lat. Descarrega-ho: https://nodejs.org/dist/v18.18.2/node-v18.18.2-x64.msi
    exit /b
) ELSE (
    echo ✅ Node.js detectat
)

:: ==== CONFIGURACIÓ I ARRENCADA ====

:: Web (React)
cd web
echo 📦 Instal·lant dependències React...
call npm install
cd ..

:: App (Flutter)
cd app
echo 📦 flutter pub get
call flutter pub get
cd ..

:: Backend + BDD
cd docker
echo 🐳 Arrencant serveis Docker...
call docker compose up --build
cd ..

echo.
echo ✅ MoodTunes operatiu! Pots executar ara Flutter amb: cd app && flutter run
pause
