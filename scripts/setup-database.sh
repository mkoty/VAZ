#!/bin/bash
# Скрипт настройки PostgreSQL базы данных

set -e

echo "🗄️  Настройка PostgreSQL базы данных..."

# Запрос пароля от пользователя
read -sp "Введите пароль для пользователя базы данных: " DB_PASSWORD
echo

# Создание базы данных и пользователя
sudo -u postgres psql << EOF
-- Создание базы данных
CREATE DATABASE lecar_db;

-- Создание пользователя
CREATE USER lecar_user WITH PASSWORD '$DB_PASSWORD';

-- Предоставление прав
GRANT ALL PRIVILEGES ON DATABASE lecar_db TO lecar_user;

-- Дополнительные права для схемы public
\c lecar_db
GRANT ALL ON SCHEMA public TO lecar_user;
GRANT ALL ON ALL TABLES IN SCHEMA public TO lecar_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO lecar_user;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO lecar_user;

-- Установка прав по умолчанию
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO lecar_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO lecar_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO lecar_user;
EOF

echo "✅ База данных настроена!"
echo ""
echo "📝 Сохраните эти данные для подключения:"
echo "Database: lecar_db"
echo "User: lecar_user"
echo "Password: $DB_PASSWORD"
echo "Host: localhost"
echo "Port: 5432"
echo ""
echo "📝 DATABASE_URL строка подключения:"
echo "postgresql://lecar_user:$DB_PASSWORD@localhost:5432/lecar_db"
