# 📧 Настройка Gmail на Railway

## Ваши данные для Gmail

```
EMAIL_USER=stepansichkar@gmail.com
EMAIL_PASSWORD=dkvvhtaoizlzlgck
```

⚠️ **Важно:** Пароль БЕЗ пробелов!

## Шаги настройки

### 1️⃣ Откройте Railway Dashboard

1. Перейдите на https://railway.app
2. Войдите в аккаунт
3. Откройте проект с backend (vaz-backend-production-8550)

### 2️⃣ Перейдите в Variables

```
Выберите backend сервис → Variables
```

### 3️⃣ Обновите/добавьте переменные

Найдите существующие переменные `EMAIL_USER` и `EMAIL_PASSWORD` и измените их:

**Или добавьте новые, если их нет:**

Нажмите **+ New Variable** для каждой:

**Переменная 1:**
```
Variable name: EMAIL_USER
Value: stepansichkar@gmail.com
```

**Переменная 2:**
```
Variable name: EMAIL_PASSWORD
Value: dkvvhtaoizlzlgck
```

⚠️ **ВАЖНО:** Пароль вставляйте БЕЗ пробелов: `dkvvhtaoizlzlgck`

### 4️⃣ Сохраните

Нажмите **Add** для каждой переменной.

Railway автоматически перезапустит сервис.

### 5️⃣ Подождите 1-2 минуты

Railway задеплоит обновление с новыми переменными.

### 6️⃣ Проверьте логи

```
Railway Dashboard → Deployments → Latest deployment → View Logs
```

Ищите сообщение:
```
✅ SMTP сервер готов к отправке писем
```

Если видите:
```
❌ Ошибка подключения к SMTP: ...
```

Проверьте, что:
- Пароль без пробелов
- Email правильный
- Прошло 2-3 минуты после сохранения

### 7️⃣ Протестируйте!

1. Откройте приложение: https://[username].github.io/VAZ
2. Нажмите "Войти через LADA ID"
3. Введите email: stepansichkar@gmail.com (или любой другой для теста)
4. Нажмите "Получить код"
5. Проверьте почту - код должен прийти!

## ✅ Готово!

Теперь email отправка работает через Gmail на Railway.

## 🔍 Отладка

### Если код не приходит:

1. **Проверьте логи Railway:**
   ```
   Deployments → View Logs
   ```
   
   Должно быть:
   ```
   🔍 Поиск пользователя email=test@example.com
   🆕 Сгенерирован новый код для test@example.com
   ✅ Код отправлен на email test@example.com
   Message ID: <...@gmail.com>
   ```

2. **Проверьте переменные:**
   - Railway → Variables
   - EMAIL_USER = stepansichkar@gmail.com
   - EMAIL_PASSWORD = dkvvhtaoizlzlgck (БЕЗ пробелов!)

3. **Проверьте Gmail:**
   - Папка "Входящие"
   - Папка "Спам"
   - Gmail может задерживать первые письма на 1-2 минуты

### Если ошибка "Invalid login":

- Убедитесь что используете App Password, а не обычный пароль
- Создайте новый App Password: https://myaccount.google.com/apppasswords
- Обновите переменную EMAIL_PASSWORD на Railway

### Если ошибка "Connection timeout":

- Подождите 5 минут и попробуйте снова
- Gmail может временно блокировать новые подключения
- Проверьте https://myaccount.google.com/notifications - нет ли предупреждений

## 📝 Примечания

- Gmail может потребовать подтверждения нового устройства при первой отправке
- Проверьте https://myaccount.google.com/device-activity
- Первое письмо может идти 1-2 минуты, последующие - моментально
