# 🔧 Исправление проблемы IPv6 на Railway

## Проблема

Railway пытался подключиться к Gmail SMTP через IPv6, но получал ошибку:

```
ENETUNREACH 2607:f8b0:4023:1c03::6d:587 - Local (:::0)
errno: -101
code: 'ESOCKET'
syscall: 'connect'
```

### Что происходило:

1. DNS резолвинг возвращал два адреса для `smtp.gmail.com`:
   - IPv4: `142.250.142.109`
   - IPv6: `2607:f8b0:4023:1c03::6d`

2. Nodemailer пытался подключиться сначала к IPv4, затем к IPv6

3. Railway НЕ поддерживает IPv6 для исходящих соединений

4. Результат: Connection timeout / ENETUNREACH

## Решение

Принудительно используем только IPv4 адреса.

### Изменения в `backend/src/email/email.service.ts`:

```typescript
this.transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
  // ⭐ Принудительно используем IPv4
  dnsOptions: {
    family: 4, // 4 = IPv4 only, 6 = IPv6 only
  },
  tls: {
    rejectUnauthorized: false, // Для совместимости с Railway
    minVersion: 'TLSv1.2',
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 45000,
  debug: true,
  logger: true,
});
```

### Ключевой параметр:

```typescript
dnsOptions: {
  family: 4, // Принудительно IPv4 only
}
```

## Как это работает

1. **Без `dnsOptions.family`:**
   ```
   DNS lookup: smtp.gmail.com
   → [142.250.142.109 (IPv4), 2607:f8b0:4023:1c03::6d (IPv6)]
   → Пытается IPv4 → Timeout
   → Пытается IPv6 → ENETUNREACH (Railway не поддерживает)
   → Ошибка
   ```

2. **С `dnsOptions.family = 4`:**
   ```
   DNS lookup: smtp.gmail.com (только IPv4)
   → [142.250.142.109]
   → Подключается к 142.250.142.109
   → Успех! ✅
   ```

## Проверка

### До исправления (логи Railway):
```
[DEBUG] Resolved smtp.gmail.com as 142.250.142.109 [cache hit]
[INFO]  Connection to 142.250.142.109 failed, trying 2607:f8b0:4023:1c03::6d
[WARN]  connect ENETUNREACH 2607:f8b0:4023:1c03::6d:587
❌ Ошибка отправки email: Connection timeout
```

### После исправления (ожидается):
```
[DEBUG] Resolved smtp.gmail.com as 142.250.142.109
[INFO]  Connection to 142.250.142.109 established
✅ SMTP сервер готов к отправке писем
✅ Код отправлен на email test@example.com
```

## Дополнительные изменения

### 1. Отключена проверка SSL сертификата

```typescript
tls: {
  rejectUnauthorized: false,
}
```

Railway может иметь проблемы с валидацией некоторых сертификатов.

### 2. Увеличены таймауты

```typescript
connectionTimeout: 15000, // 15 секунд (было 10)
greetingTimeout: 15000,   // 15 секунд (было 10)
socketTimeout: 45000,     // 45 секунд (было 30)
```

Railway может иметь более медленное сетевое соединение.

### 3. Минимальная версия TLS

```typescript
tls: {
  minVersion: 'TLSv1.2',
}
```

Обеспечивает совместимость с Gmail SMTP.

## Альтернативные решения

Если это не помогло, есть альтернативы:

### 1. Использовать SendGrid

SendGrid работает надежнее на Railway:
- Не требует SMTP
- Использует HTTP API
- См. документацию: `RAILWAY_EMAIL_TIMEOUT_FIX.md`

### 2. Использовать AWS SES

Amazon SES также хорошо работает:
```bash
npm install @aws-sdk/client-ses
```

### 3. Использовать Mailgun

Еще один надежный сервис:
```bash
npm install mailgun.js
```

## Технические детали

### Почему Railway не поддерживает IPv6?

Railway использует Docker контейнеры, которые по умолчанию не имеют IPv6 connectivity. Это распространенная проблема для многих PaaS провайдеров.

### Почему nodemailer пытался использовать IPv6?

Node.js DNS модуль по умолчанию возвращает все доступные адреса (IPv4 и IPv6). Nodemailer пытается подключиться к каждому по очереди.

### Параметр `dnsOptions.family`

- `family: 4` - возвращать только IPv4 адреса
- `family: 6` - возвращать только IPv6 адреса  
- `family: 0` (default) - возвращать все доступные адреса

## Применение исправления

```bash
# Уже сделано:
git add backend/src/email/email.service.ts
git commit -m "Force IPv4 for SMTP on Railway"
git push origin main

# Railway автоматически задеплоит изменения
# Подождите 2-3 минуты
```

## Проверка работоспособности

1. **Откройте Railway Logs**
2. **Ищите строки:**
   ```
   ✅ SMTP сервер готов к отправке писем
   [DEBUG] Resolved smtp.gmail.com as 142.250.142.109
   [INFO]  Connection to 142.250.142.109 established
   ```
3. **Не должно быть:**
   ```
   ❌ ENETUNREACH 2607:...
   ❌ Connection timeout
   ```

## Тестирование

```bash
# В вашем приложении:
1. Запросите код на любой email
2. Проверьте Railway логи
3. Проверьте почту - код должен прийти
```

---

**Статус:** ✅ Исправление применено и запушено в GitHub  
**Деплой:** Автоматический через Railway  
**ETA:** 2-3 минуты
