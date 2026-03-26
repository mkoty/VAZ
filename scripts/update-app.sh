#!/bin/bash
# Скрипт обновления приложения (для последующих деплоев)

set -e

echo "🔄 Обновление приложения VAZ..."

cd /var/www/vaz

# Обновление кода
echo "📥 Получение последней версии из Git..."
git pull

# Обновление backend
echo "📦 Обновление backend..."
cd backend
npm install
npm run build
pm2 restart vaz-backend

# Обновление frontend
echo "📦 Обновление frontend..."
cd ..
npm install
npm run build
pm2 restart vaz-frontend

echo "✅ Приложение обновлено!"
echo ""
echo "📊 Статус приложений:"
pm2 status
