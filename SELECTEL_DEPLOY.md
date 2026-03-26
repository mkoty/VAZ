# Деплой на Selectel Cloud

## Преимущества Selectel
- ✅ Оплата российскими картами (Мир, Visa, Mastercard)
- ✅ Стабильная работа
- ✅ Русскоязычная поддержка 24/7
- ✅ Дата-центры в России
- 💰 ~500-800₽/месяц за всю инфраструктуру

## Шаг 1: Регистрация

1. Перейдите на https://selectel.ru/
2. Нажмите "Регистрация"
3. Заполните форму (российский номер телефона)
4. Пополните баланс на ~1000₽ (хватит на 1-2 месяца)

## Шаг 2: Создание сервера

### Вариант A: Managed Kubernetes (проще)

1. В панели управления выберите **"Cloud Platform"**
2. Создайте кластер Kubernetes
3. Установите `kubectl` локально
4. Разверните приложения через Helm или манифесты

### Вариант B: VPS (рекомендую для начала)

1. В панели управления выберите **"Серверы"** → **"Создать сервер"**
2. Выберите конфигурацию:
   - **ОС**: Ubuntu 22.04 LTS
   - **Тариф**: Start-2 (2 vCPU, 2GB RAM) - ~500₽/мес
   - **Диск**: 20 GB SSD
3. Создайте сервер и сохраните:
   - IP адрес
   - Пароль root

## Шаг 3: Настройка сервера

Подключитесь по SSH:

```bash
ssh root@ваш-ip-адрес
```

### Установка Node.js и npm:

```bash
# Обновление системы
apt update && apt upgrade -y

# Установка Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Проверка установки
node -v  # должно быть v20.x.x
npm -v
```

### Установка PostgreSQL:

```bash
# Установка PostgreSQL 14
apt install -y postgresql postgresql-contrib

# Запуск PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Создание базы данных и пользователя
sudo -u postgres psql

# В psql выполните:
CREATE DATABASE lecar_db;
CREATE USER lecar_user WITH PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE lecar_db TO lecar_user;
\q
```

### Установка PM2 (менеджер процессов):

```bash
npm install -g pm2
```

### Установка Nginx (реверс-прокси):

```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

## Шаг 4: Деплой Backend

```bash
# Создание директории для приложения
mkdir -p /var/www/vaz
cd /var/www/vaz

# Клонирование репозитория
git clone https://github.com/ваш-username/VAZ.git .

# Установка зависимостей backend
cd backend
npm install

# Создание .env файла
cat > .env << EOF
NODE_ENV=production
DATABASE_URL=postgresql://lecar_user:your_strong_password@localhost:5432/lecar_db
PORT=3001
EOF

# Сборка backend
npm run build

# Запуск backend через PM2
pm2 start dist/main.js --name vaz-backend
pm2 save
pm2 startup
```

## Шаг 5: Деплой Frontend

```bash
cd /var/www/vaz

# Создание .env.local для frontend
cat > .env.local << EOF
NODE_ENV=production
DEPLOY_TARGET=production
NEXT_PUBLIC_API_URL=http://ваш-ip-адрес:3001
EOF

# Установка зависимостей frontend
npm install

# Сборка frontend
npm run build

# Запуск frontend через PM2
pm2 start npm --name vaz-frontend -- start
pm2 save
```

## Шаг 6: Настройка Nginx

Создайте конфигурацию Nginx:

```bash
cat > /etc/nginx/sites-available/vaz << 'EOF'
server {
    listen 80;
    server_name ваш-ip-адрес;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Активация конфигурации
ln -s /etc/nginx/sites-available/vaz /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Проверка конфигурации
nginx -t

# Перезапуск Nginx
systemctl restart nginx
```

## Шаг 7: Настройка файрвола

```bash
# Установка UFW
apt install -y ufw

# Разрешение SSH, HTTP, HTTPS
ufw allow 22
ufw allow 80
ufw allow 443

# Включение файрвола
ufw enable
```

## Шаг 8: Настройка SSL (опционально, но рекомендуется)

```bash
# Установка Certbot
apt install -y certbot python3-certbot-nginx

# Получение SSL сертификата (после привязки домена)
certbot --nginx -d ваш-домен.ru

# Автоматическое обновление сертификата
certbot renew --dry-run
```

## Шаг 9: Проверка работы

1. Откройте браузер
2. Перейдите по адресу: `http://ваш-ip-адрес`
3. Проверьте:
   - ✅ Frontend загружается
   - ✅ Стили применяются
   - ✅ API запросы работают

## Управление приложением

### Просмотр логов:
```bash
# Логи backend
pm2 logs vaz-backend

# Логи frontend
pm2 logs vaz-frontend

# Все логи
pm2 logs
```

### Перезапуск приложений:
```bash
# Перезапуск backend
pm2 restart vaz-backend

# Перезапуск frontend
pm2 restart vaz-frontend

# Перезапуск всех
pm2 restart all
```

### Обновление кода:
```bash
cd /var/www/vaz
git pull

# Backend
cd backend
npm install
npm run build
pm2 restart vaz-backend

# Frontend
cd ..
npm install
npm run build
pm2 restart vaz-frontend
```

## Автоматический деплой через GitHub Actions

Создайте `.github/workflows/deploy-selectel.yml`:

```yaml
name: Deploy to Selectel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Selectel VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SELECTEL_HOST }}
          username: root
          password: ${{ secrets.SELECTEL_PASSWORD }}
          script: |
            cd /var/www/vaz
            git pull
            cd backend
            npm install
            npm run build
            pm2 restart vaz-backend
            cd ..
            npm install
            npm run build
            pm2 restart vaz-frontend
```

Добавьте secrets в GitHub:
- `SELECTEL_HOST` - IP адрес вашего сервера
- `SELECTEL_PASSWORD` - пароль root

## Мониторинг

### Установка мониторинга PM2:
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Системный мониторинг:
```bash
# Использование ресурсов
pm2 monit

# Статус процессов
pm2 status

# Информация о системе
pm2 info vaz-backend
```

## Backup базы данных

Создайте скрипт backup:

```bash
cat > /root/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/root/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -U lecar_user lecar_db > $BACKUP_DIR/backup_$TIMESTAMP.sql
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x /root/backup-db.sh

# Добавление в cron (ежедневно в 3:00)
(crontab -l 2>/dev/null; echo "0 3 * * * /root/backup-db.sh") | crontab -
```

## Стоимость

| Компонент | Цена/месяц |
|-----------|-----------|
| VPS (Start-2: 2 vCPU, 2GB RAM) | ~500₽ |
| Диск 20 GB SSD | включено |
| IP адрес | включено |
| Трафик | включено |
| **ИТОГО** | **~500₽/мес** |

## Поддержка

- 📧 Email: support@selectel.ru
- 💬 Чат: в личном кабинете
- 📞 Телефон: 8 800 700 06 08
- 📚 Документация: https://docs.selectel.ru/

## Следующие шаги

1. ✅ Привяжите домен
2. ✅ Настройте SSL сертификат
3. ✅ Настройте автоматический деплой
4. ✅ Настройте мониторинг
5. ✅ Настройте backup
