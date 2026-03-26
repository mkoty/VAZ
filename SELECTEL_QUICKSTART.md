# Быстрый старт деплоя на Selectel

## 📋 Что вам понадобится

- ✅ Аккаунт на Selectel (https://selectel.ru)
- ✅ ~1000₽ на балансе
- ✅ 30 минут времени

---

## Шаг 1: Создание VPS сервера на Selectel

1. Зайдите на https://selectel.ru и авторизуйтесь
2. Перейдите в **"Облачная платформа"** → **"Серверы"**
3. Нажмите **"Создать сервер"**
4. Выберите:
   - **Регион**: Москва или Санкт-Петербург
   - **ОС**: Ubuntu 22.04 LTS
   - **Конфигурация**: Start-2 (2 vCPU, 2GB RAM) - ~500₽/мес
   - **Диск**: 20 GB SSD
   - **Имя**: vaz-production
5. Нажмите **"Создать сервер"**
6. **Сохраните**:
   - IP адрес сервера
   - Пароль root (будет отправлен на email)

---

## Шаг 2: Подключение к серверу

Откройте терминал и подключитесь по SSH:

```bash
ssh root@ВАШ_IP_АДРЕС
```

Введите пароль, который пришёл на email.

---

## Шаг 3: Начальная настройка сервера

Скопируйте и выполните команду на сервере:

```bash
curl -fsSL https://raw.githubusercontent.com/ваш-username/VAZ/main/scripts/setup-server.sh | bash
```

Или вручную:

```bash
# Загрузка скрипта
wget https://raw.githubusercontent.com/ваш-username/VAZ/main/scripts/setup-server.sh

# Запуск скрипта
bash setup-server.sh
```

Этот скрипт установит:
- Node.js 20
- PostgreSQL
- Nginx
- PM2
- Git
- Настроит firewall

⏱️ Займёт ~5-10 минут

---

## Шаг 4: Настройка базы данных

```bash
bash /var/www/vaz/scripts/setup-database.sh
```

Скрипт запросит:
- Пароль для пользователя базы данных (придумайте надёжный)

**Сохраните** строку подключения, она понадобится на следующем шаге!

---

## Шаг 5: Деплой приложения

```bash
bash /var/www/vaz/scripts/deploy-app.sh
```

Скрипт запросит:
1. URL репозитория: `https://github.com/ваш-username/VAZ.git`
2. DATABASE_URL (из предыдущего шага)
3. IP адрес сервера (для frontend)

⏱️ Займёт ~5 минут

---

## Шаг 6: Настройка Nginx

```bash
bash /var/www/vaz/scripts/setup-nginx.sh
```

Скрипт запросит IP адрес или домен сервера.

---

## Шаг 7: Проверка

Откройте в браузере:
```
http://ВАШ_IP_АДРЕС
```

Должен открыться ваш сайт с примененными стилями! 🎉

---

## 🔧 Полезные команды

### Просмотр логов:
```bash
pm2 logs vaz-backend   # Логи backend
pm2 logs vaz-frontend  # Логи frontend
pm2 logs               # Все логи
```

### Статус приложений:
```bash
pm2 status
```

### Перезапуск приложений:
```bash
pm2 restart vaz-backend   # Перезапуск backend
pm2 restart vaz-frontend  # Перезапуск frontend
pm2 restart all           # Перезапуск всех
```

### Обновление приложения:
```bash
bash /var/www/vaz/scripts/update-app.sh
```

### Просмотр логов Nginx:
```bash
tail -f /var/log/nginx/vaz-access.log  # Access логи
tail -f /var/log/nginx/vaz-error.log   # Error логи
```

---

## 🤖 Автоматический деплой через GitHub Actions

### 1. Добавьте secrets в GitHub:

Перейдите в репозиторий → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Добавьте:
- `SELECTEL_HOST` = IP адрес вашего сервера
- `SELECTEL_USERNAME` = `root`
- `SELECTEL_PASSWORD` = пароль root

### 2. Готово!

Теперь при каждом push в ветку `main` приложение будет автоматически обновляться на сервере.

---

## 🔒 Настройка SSL (опционально)

Для защищённого HTTPS подключения:

```bash
# Установка Certbot
apt install -y certbot python3-certbot-nginx

# Получение SSL сертификата (нужен домен!)
certbot --nginx -d ваш-домен.ru

# Автообновление сертификата
certbot renew --dry-run
```

---

## 📊 Мониторинг

### Установка мониторинга PM2:
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Системный мониторинг:
```bash
pm2 monit  # Интерактивный мониторинг
htop       # Использование ресурсов
df -h      # Использование диска
free -h    # Использование памяти
```

---

## 🗄️ Backup базы данных

### Создание backup:
```bash
pg_dump -U lecar_user lecar_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Восстановление из backup:
```bash
psql -U lecar_user lecar_db < backup_20240327_120000.sql
```

### Автоматический backup (ежедневно в 3:00):
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
(crontab -l 2>/dev/null; echo "0 3 * * * /root/backup-db.sh") | crontab -
```

---

## 🆘 Troubleshooting

### Приложение не запускается:
```bash
# Проверка логов
pm2 logs

# Перезапуск
pm2 restart all

# Проверка портов
netstat -tulpn | grep -E ':(3000|3001)'
```

### Nginx ошибки:
```bash
# Проверка конфигурации
nginx -t

# Перезапуск Nginx
systemctl restart nginx

# Проверка статуса
systemctl status nginx
```

### База данных не подключается:
```bash
# Проверка статуса PostgreSQL
systemctl status postgresql

# Проверка подключения
psql -U lecar_user -d lecar_db -h localhost
```

---

## 💰 Стоимость

| Компонент | Цена/месяц |
|-----------|-----------|
| VPS Start-2 (2 vCPU, 2GB RAM) | ~500₽ |
| Диск 20 GB SSD | включено |
| IP адрес | включено |
| Трафик | включено |
| **ИТОГО** | **~500₽/мес** |

---

## 📞 Поддержка Selectel

- 📧 Email: support@selectel.ru
- 💬 Чат: в личном кабинете
- 📞 Телефон: 8 800 700 06 08
- 📚 Документация: https://docs.selectel.ru/

---

## ✅ Checklist после деплоя

- [ ] Сервер создан и доступен по SSH
- [ ] Установлены все зависимости (Node.js, PostgreSQL, Nginx)
- [ ] База данных настроена
- [ ] Backend запущен и работает
- [ ] Frontend запущен и работает
- [ ] Nginx настроен и проксирует запросы
- [ ] Сайт открывается в браузере
- [ ] Стили применяются корректно
- [ ] API запросы работают
- [ ] GitHub Actions настроен (опционально)
- [ ] SSL сертификат установлен (опционально)
- [ ] Backup настроен (опционально)

---

Готово! Ваше приложение развёрнуто на Selectel! 🚀
