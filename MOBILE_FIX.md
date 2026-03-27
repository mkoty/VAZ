# 🔧 Исправление: API URL для мобильных устройств

## Проблема

На мобильных устройствах возникала ошибка:
```
Fetch API cannot load http://localhost:3001/auth/request-code 
due to access control checks.
```

## Причина

Frontend пытался подключиться к `localhost:3001`, который не существует на мобильном устройстве.

## Решение

Теперь frontend **по умолчанию** использует production backend на Railway:
```
https://vaz-backend-production-8550.up.railway.app
```

## Что изменилось

### lib/api.ts
```typescript
// Раньше (неправильно):
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Сейчас (правильно):
const PRODUCTION_API_URL = 'https://vaz-backend-production-8550.up.railway.app';
const API_URL = process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API_URL;
```

### Локальная разработка

Для локальной разработки создайте `.env.local`:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
```

Файл `.env.local` уже в `.gitignore` и не попадет в коммит.

## Тестирование

### 1. Локально на компьютере
```bash
npm run dev
# Откройте http://localhost:3000
```

### 2. На мобильном устройстве

#### Узнайте IP компьютера:
```bash
ipconfig getifaddr en0
# Пример: 192.168.1.100
```

#### Откройте на телефоне:
```
http://192.168.1.100:3000
```

#### Проверьте в консоли браузера на телефоне:
```
🔗 API URL: https://vaz-backend-production-8550.up.railway.app
```

### 3. На GitHub Pages

После деплоя автоматически использует production backend.

## Как это работает

1. **Production (GitHub Pages)**: 
   - `NEXT_PUBLIC_API_URL` установлен в GitHub Actions workflow
   - Использует Railway backend

2. **Development без .env.local**:
   - Fallback на `PRODUCTION_API_URL`
   - Подключается к Railway backend

3. **Development с .env.local**:
   - Использует `http://localhost:3001`
   - Подключается к локальному backend

## Отладка

В консоли браузера всегда показывается используемый API URL:
```javascript
console.log('🔗 API URL:', API_URL);
```

Откройте консоль разработчика (F12) и проверьте, какой URL используется.

## Коммиты

Исправление включено в коммит:
```
Исправление API URL для мобильных устройств и GitHub Pages
```
