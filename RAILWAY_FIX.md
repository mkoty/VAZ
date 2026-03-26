# 🚄 Railway - Правильная настройка монорепо

## ⚠️ Проблема
Railway собирает frontend (Next.js) вместо backend (NestJS).

## ✅ Решение

### Способ 1: Удалить и пересоздать сервисы (РЕКОМЕНДУЮ)

#### Шаг 1: Удалить текущий сервис
1. В Railway откройте проблемный сервис
2. **"Settings"** → прокрутите вниз
3. **"Danger Zone"** → **"Remove Service"**
4. Подтвердите удаление

#### Шаг 2: Создать Backend сервис заново
1. В проекте нажмите **"+ New"**
2. **"GitHub Repo"**
3. Выберите репозиторий **"VAZ"**
4. **ВАЖНО**: Railway спросит какую директорию использовать
5. Выберите или введите: **`backend`**

Если не спрашивает директорию:
- После создания сервиса зайдите в **"Settings"**
- Найдите секцию **"Source"** или **"Build"**
- Там должно быть поле **"Root Directory"** = `backend`

#### Шаг 3: Настроить переменные окружения
В разделе **"Variables"**:
```
NODE_ENV=production
```

#### Шаг 4: Добавить PostgreSQL
1. **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway автоматически добавит `DATABASE_URL` к backend сервису

#### Шаг 5: Настроить Healthcheck (если нужно)
В **"Settings"**:
- **Healthcheck Path**: `/api/health`
- **Healthcheck Timeout**: 300

---

### Способ 2: Настроить через Service Settings

1. Откройте проблемный сервис
2. **"Settings"** → **"Service"** или **"Source"**
3. Ищите поле:
   - **"Root Directory"**
   - **"Working Directory"**
   - **"Source Directory"**
4. Укажите: `backend`
5. Сохраните

Railway пересоберёт автоматически.

---

### Способ 3: Через переменную окружения

В **"Variables"** добавьте:
```
RAILWAY_WORKDIR=/app/backend
```

Или

```
NIXPACKS_INSTALL_CMD=cd backend && npm ci
NIXPACKS_BUILD_CMD=cd backend && npm run build
NIXPACKS_START_CMD=cd backend && npm start
```

---

## 🎯 Проверка правильности настройки

После правильной настройки в логах сборки вы должны увидеть:

```
✓ Compiled successfully
```

**НЕ** должно быть:
- ❌ `next build`
- ❌ `Route (app)`
- ❌ `First Load JS`

---

## 📁 Структура для Railway

### Backend сервис:
- Repository: `mkoty/VAZ`
- Root Directory: **`backend`**
- Build: автоматически (nixpacks)
- Start: `npm start`
- Healthcheck: `/api/health`

### Frontend сервис:
- Repository: `mkoty/VAZ`
- Root Directory: **`/`** (корень)
- Build: автоматически (nixpacks)
- Start: `npm start`

---

## 🆘 Если всё равно не работает

### Проверьте логи:
1. Откройте сервис
2. **"Deployments"** → последний деплой
3. **"View Logs"**

Ищите в логах:
- Какой `package.json` используется?
- Какая команда build запускается?
- Откуда берётся код?

### Создайте ticket в Railway:
1. Discord: https://discord.gg/railway
2. Канал: #help
3. Опишите проблему с монорепо

---

## 🎉 После успешного деплоя

Backend будет доступен:
```
https://ваш-backend.up.railway.app/api/health
```

Должен вернуть:
```json
{
  "status": "ok",
  "timestamp": "2024-03-27T...",
  "service": "vaz-backend"
}
```

---

## 💡 Альтернатива: Разделить репозитории

Если Railway не поддерживает монорепо хорошо:

1. Создайте отдельный репозиторий для backend
2. Перенесите содержимое `backend/` в корень нового репозитория
3. Задеплойте на Railway

Это самый простой и надёжный вариант.
