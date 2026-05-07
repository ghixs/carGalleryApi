#!/bin/bash

echo "🚗 Car Gallery - Frontend ve Backend Başlatma Scripti"
echo "======================================================"
echo ""

# Frontend dizinine git ve bağımlılıkları kontrol et
echo "📦 Frontend bağımlılıkları kontrol ediliyor..."
cd "$(dirname "$0")/CarGallery-Frontend"

if [ ! -d "node_modules" ]; then
    echo "📥 Node modules yükleniyor..."
    npm install
else
    echo "✅ Node modules mevcut"
fi

echo ""
echo "🚀 Frontend başlatılıyor (Port 3000)..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Frontend başlatıldı (PID: $FRONTEND_PID)"
echo ""
echo "📝 Not: Backend'i ayrı bir terminalde başlatmayı unutmayın:"
echo "   cd CarGallery"
echo "   dotnet run"
echo ""
echo "🌐 Uygulamaya erişim:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "Demo Hesaplar:"
echo "   Admin:    admin / admin"
echo "   Kullanıcı: Herhangi bir kullanıcı adı/şifre"
echo ""
echo "Durdurmak için Ctrl+C tuşlarına basın"

# Wait for Ctrl+C
wait $FRONTEND_PID
