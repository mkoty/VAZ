#!/bin/bash
# Скрипт деплоя приложения на Selectel

set -e

echo "🚀 Деплой приложения VAZ..."

# Переход в директорию приложения
cd /var/www/vaz

# Проверка наличия репозитория
if [ ! -d ".git" ]; then
    echo "📥 Клонирование репозитория..."
    read -p "Введите URL репозитория (например, https://github.com/username/VAZ.git): " REPO_URL
    cd ..
    rm -rf vaz
    git clone "$REPO_URL" vaz
    cd vaz
else
    echo "📥 Обновление кода из репозитория..."
    git pull
fi

# Проверка наличия .env для backend
if [ ! -f "backend/.env" ]; then
    echo "⚙️  Создание backend/.env файла..."
    read -p "Введите DATABASE_URL (например, postgresql://user:pass@localhost:5432/db): " DATABASE_URL

    cat > backend/.env << EOF
NODE_ENV=production
DATABASE_URL=$DATABASE_URL
PORT=3001
EOF
    echo "✅ backend/.env создан"
fi

# Установка и сборка backend
echo "📦 Установка зависимостей backend..."
cd backend
npm install

echo "🔨 Сборка backend..."
npm run build

echo "🚀 Запуск backend через PM2..."
pm2 delete vaz-backend 2>/dev/null || true
pm2 start dist/main.js --name vaz-backend
echo "✅ Backend запущен"

# Проверка наличия .env.local для frontend
cd ..
if [ ! -f ".env.local" ]; then
    echo "⚙️  Создание .env.local файла для frontend..."
    read -p "Введите IP адрес сервера: " SERVER_IP

    cat > .env.local << EOF
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://$SERVER_IP/api
EOF
    echo "✅ .env.local создан"
fi

# Установка и сборка frontend
echo "📦 Установка зависимостей frontend..."
npm install

echo "🔨 Сборка frontend..."
npm run build

echo "🚀 Запуск frontend через PM2..."
pm2 delete vaz-frontend 2>/dev/null || true
pm2 start npm --name vaz-frontend -- start

# Сохранение конфигурации PM2
pm2 save

# Настройка автозапуска PM2
pm2 startup systemd -u root --hp /root 2>/dev/null || true

echo "✅ Приложение развернуто!"
echo ""
echo "📊 Статус приложений:"
pm2 status

echo ""
echo "📝 Следующие шаги:"
echo "1. Настройте Nginx (scripts/setup-nginx.sh)"
echo "2. Откройте http://$SERVER_IP в браузере"
echo ""
echo "📋 Полезные команды:"
echo "  pm2 logs vaz-backend   - Логи backend"
echo "  pm2 logs vaz-frontend  - Логи frontend"
echo "  pm2 restart all        - Перезапуск всех приложений"
