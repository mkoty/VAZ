#!/bin/bash
# Скрипт настройки Nginx для проекта VAZ

set -e

echo "🌐 Настройка Nginx..."

# Запрос IP адреса или домена
read -p "Введите IP адрес сервера или домен: " SERVER_NAME

# Создание конфигурации Nginx
cat > /etc/nginx/sites-available/vaz << EOF
server {
    listen 80;
    server_name $SERVER_NAME;

    # Логи
    access_log /var/log/nginx/vaz-access.log;
    error_log /var/log/nginx/vaz-error.log;

    # Frontend - все запросы, кроме /api
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Таймауты
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # CORS заголовки (если нужно)
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;

        # Таймауты
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Увеличение размера загружаемых файлов
    client_max_body_size 10M;
}
EOF

# Удаление дефолтной конфигурации
rm -f /etc/nginx/sites-enabled/default

# Активация конфигурации
ln -sf /etc/nginx/sites-available/vaz /etc/nginx/sites-enabled/

# Проверка конфигурации
echo "🔍 Проверка конфигурации Nginx..."
nginx -t

# Перезапуск Nginx
echo "🔄 Перезапуск Nginx..."
systemctl restart nginx

echo "✅ Nginx настроен!"
echo ""
echo "🌐 Приложение доступно по адресу: http://$SERVER_NAME"
echo ""
echo "📝 Для настройки SSL сертификата выполните:"
echo "   apt install certbot python3-certbot-nginx"
echo "   certbot --nginx -d $SERVER_NAME"
