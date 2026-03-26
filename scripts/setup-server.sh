#!/bin/bash
# Скрипт начальной настройки сервера Selectel для проекта VAZ

set -e

echo "🚀 Начало настройки сервера Selectel..."

# Обновление системы
echo "📦 Обновление системы..."
apt update && apt upgrade -y

# Установка Node.js 20
echo "📦 Установка Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Проверка версий
echo "✅ Node.js версия: $(node -v)"
echo "✅ npm версия: $(npm -v)"

# Установка PostgreSQL
echo "📦 Установка PostgreSQL..."
apt install -y postgresql postgresql-contrib

# Запуск PostgreSQL
systemctl start postgresql
systemctl enable postgresql

echo "✅ PostgreSQL установлен и запущен"

# Установка PM2
echo "📦 Установка PM2..."
npm install -g pm2

# Установка Nginx
echo "📦 Установка Nginx..."
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# Установка Git
echo "📦 Установка Git..."
apt install -y git

# Установка UFW (firewall)
echo "🔒 Настройка файрвола..."
apt install -y ufw
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

# Создание директории для приложения
echo "📁 Создание директории для приложения..."
mkdir -p /var/www/vaz

echo "✅ Сервер настроен! Следующие шаги:"
echo "1. Настройте PostgreSQL базу данных (setup-database.sh)"
echo "2. Клонируйте репозиторий (deploy-app.sh)"
echo "3. Настройте Nginx (setup-nginx.sh)"
