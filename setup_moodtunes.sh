#!/bin/bash

echo "🔧 Instal·lació de dependències del frontend (React)..."
cd web || exit 1
npm install
npm install react-router-dom bootstrap vite
cd ..

echo "🐳 Arrencant serveis Docker (backend, BDD, phpMyAdmin)..."
cd docker || exit 1
docker compose up --build -d
cd ..

echo "✅ Entorn preparat correctament."
echo "📦 Frontend: executa 'cd web && npm run dev'"
echo "🖥 phpMyAdmin disponible a: http://localhost:8080"
