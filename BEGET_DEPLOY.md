# 🇷🇺 Beget Cloud - Самый простой российский хостинг!

## Почему Beget?

- ✅ **Панель на русском** - всё понятно
- ✅ **Поддержка 24/7** на русском языке
- ✅ **Node.js** встроенный
- ✅ **PostgreSQL** в пару кликов
- ✅ **Оплата**: Мир, Visa, Mastercard
- 💰 **~300-500₽/мес** - дешевле конкурентов!

---

## 🚀 Быстрый старт (5 минут)

### Шаг 1: Регистрация (1 минута)

1. Перейдите на https://beget.com/ru/cloud
2. Нажмите **"Попробовать бесплатно"**
3. Заполните форму регистрации
4. Подтвердите email
5. Пополните баланс на **500-1000₽**

💡 Beget даёт **тестовый период** на 14 дней!

---

### Шаг 2: Создание облачного сервера (2 минуты)

#### 2.1. Создание сервера:

1. В панели управления выберите **"Облачные VPS"**
2. Нажмите **"Создать сервер"**
3. Выберите конфигурацию:
   - **ОС**: Ubuntu 22.04
   - **Тариф**: START-1 (1 vCPU, 1GB RAM) - ~300₽/мес
   - **Диск**: 10 GB SSD
4. Нажмите **"Создать"**
5. **Сохраните**:
   - IP адрес
   - Пароль root (придёт на email)

#### 2.2. Создание PostgreSQL:

1. В панели выберите **"Базы данных"** → **"PostgreSQL"**
2. Нажмите **"Создать базу данных"**
3. Заполните:
   - **Имя БД**: `lecar_db`
   - **Пользователь**: `lecar_user`
   - **Пароль**: придумайте надёжный
4. Нажмите **"Создать"**
5. **Сохраните** данные для подключения

---

### Шаг 3: Установка приложения (2 минуты)

#### Подключитесь к серверу по SSH:

```bash
ssh root@ваш_ip_адрес
```

Введите пароль из email.

#### Выполните команды:

```bash
# Обновление системы
apt update && apt upgrade -y

# Установка Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git

# Установка PM2
npm install -g pm2

# Клонирование проекта
mkdir -p /var/www
cd /var/www
git clone https://github.com/mkoty/VAZ.git vaz
cd vaz

# Настройка Backend
cd backend

# Создание .env файла
cat > .env << 'EOF'
NODE_ENV=production
DATABASE_URL=postgresql://lecar_user:ваш_пароль@localhost:5432/lecar_db
PORT=3001
EOF

# Установка зависимостей и сборка
npm install
npm run build

# Запуск backend через PM2
pm2 start dist/main.js --name vaz-backend

# Настройка Frontend
cd ..

# Создание .env.local
cat > .env.local << 'EOF'
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://ваш_ip_адрес:3001
EOF

# Установка зависимостей и сборка
npm install
npm run build

# Запуск frontend через PM2
pm2 start npm --name vaz-frontend -- start

# Сохранение конфигурации PM2
pm2 save
pm2 startup
```

---

### Шаг 4: Настройка Nginx (опционально)

Если хотите чтобы сайт работал на 80 порту:

```bash
# Установка Nginx
apt install -y nginx

# Создание конфигурации
cat > /etc/nginx/sites-available/vaz << 'EOF'
server {
    listen 80;
    server_name ваш_ip_адрес;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Активация
ln -s /etc/nginx/sites-available/vaz /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

# Настройка файрвола
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable
```

---

## 🎉 Готово!

Откройте в браузере:
```
http://ваш_ip_адрес
```

Или, если настроили Nginx:
```
http://ваш_ip_адрес
```

---

## 🔧 Управление приложением

### Просмотр логов:
```bash
pm2 logs vaz-backend   # Логи backend
pm2 logs vaz-frontend  # Логи frontend
pm2 logs              # Все логи
```

### Статус приложений:
```bash
pm2 status
```

### Перезапуск:
```bash
pm2 restart vaz-backend
pm2 restart vaz-frontend
pm2 restart all
```

### Обновление приложения:
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

---

## 📊 Мониторинг в панели Beget

1. Войдите в панель управления Beget
2. Откройте **"Облачные VPS"** → ваш сервер
3. Смотрите:
   - Использование CPU
   - Использование RAM
   - Использование диска
   - Трафик

---

## 💰 Стоимость

| Компонент | Цена/месяц |
|-----------|-----------|
| VPS START-1 (1 vCPU, 1GB RAM) | ~300₽ |
| PostgreSQL | включено |
| Трафик | включено |
| IP адрес | включено |
| **ИТОГО** | **~300₽/мес** |

### Если нужно больше ресурсов:
- START-2 (2 vCPU, 2GB RAM) - ~500₽/мес
- START-3 (2 vCPU, 4GB RAM) - ~800₽/мес

---

## 🆘 Поддержка Beget

Beget известен отличной поддержкой!

- 📞 **Телефон**: 8 800 700-06-08 (бесплатно по России)
- 💬 **Онлайн-чат**: в панели управления
- 📧 **Email**: support@beget.com
- 📚 **База знаний**: https://beget.com/ru/kb
- ⏰ **Режим работы**: 24/7

---

## 🔒 Backup (резервные копии)

Beget автоматически делает backup каждый день!

### Восстановление из backup:
1. В панели Beget откройте **"Облачные VPS"**
2. Выберите ваш сервер
3. **"Резервные копии"** → выберите дату
4. Нажмите **"Восстановить"**

### Ручной backup базы данных:
```bash
# Создание backup
pg_dump -U lecar_user lecar_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановление
psql -U lecar_user lecar_db < backup_20240327_120000.sql
```

---

## 🌐 Привязка домена (опционально)

### Если у вас есть домен:

1. В панели Beget перейдите в **"Домены"**
2. Нажмите **"Добавить домен"**
3. Введите ваш домен (например, `myapp.ru`)
4. Настройте DNS записи:
   ```
   A запись: @ → IP_вашего_сервера
   A запись: www → IP_вашего_сервера
   ```

### Настройка SSL (HTTPS):

```bash
# Установка Certbot
apt install -y certbot python3-certbot-nginx

# Получение SSL сертификата
certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru

# Автообновление
certbot renew --dry-run
```

---

## 🐛 Troubleshooting

### Приложение не запускается:

```bash
# Проверка логов
pm2 logs

# Проверка статуса
pm2 status

# Перезапуск
pm2 restart all
```

### База данных не подключается:

1. Проверьте правильность `DATABASE_URL` в `backend/.env`
2. Убедитесь что PostgreSQL запущен:
   ```bash
   systemctl status postgresql
   ```
3. Проверьте что база данных создана:
   ```bash
   sudo -u postgres psql -l
   ```

### Nginx не работает:

```bash
# Проверка конфигурации
nginx -t

# Проверка статуса
systemctl status nginx

# Перезапуск
systemctl restart nginx

# Проверка логов
tail -f /var/log/nginx/error.log
```

### Не хватает памяти:

Увеличьте тариф в панели Beget:
1. **"Облачные VPS"** → ваш сервер
2. **"Изменить конфигурацию"**
3. Выберите больший тариф

---

## 📈 Оптимизация производительности

### Настройка PM2 для production:

```bash
# Запуск в cluster режиме (несколько процессов)
pm2 start dist/main.js --name vaz-backend -i 2

# Ограничение памяти
pm2 start npm --name vaz-frontend --max-memory-restart 300M -- start

# Настройка логирования
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Включение кэширования в Nginx:

```nginx
# Добавьте в конфигурацию Nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## ✅ Checklist после деплоя

- [ ] VPS сервер создан и доступен по SSH
- [ ] PostgreSQL база создана
- [ ] Node.js и PM2 установлены
- [ ] Backend собран и запущен
- [ ] Frontend собран и запущен
- [ ] Сайт открывается в браузере
- [ ] Стили применяются
- [ ] API запросы работают
- [ ] Настроен Nginx (опционально)
- [ ] Настроен SSL (опционально)
- [ ] Настроены автоматические backup

---

## 🎯 Преимущества Beget

✅ **Простота** - самая понятная панель среди российских хостингов
✅ **Поддержка** - быстро отвечают на русском языке
✅ **Цена** - дешевле Selectel и Timeweb
✅ **Надёжность** - стабильная работа
✅ **Backup** - автоматические резервные копии

---

## 🚀 Готово!

Ваше приложение развёрнуто на российском хостинге с оплатой картой Мир! 🇷🇺

**Следующие шаги:**
1. Протестируйте все функции
2. Настройте домен и SSL
3. Запустите MVP и соберите обратную связь

Удачи! 💪
