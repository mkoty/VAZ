# 🚄 Railway.app Deployment Guide

## Быстрый старт

### 1. Backend + PostgreSQL

1. Откройте https://railway.app
2. **"New Project"** → **"Deploy from GitHub repo"**
3. Выберите репозиторий **VAZ**
4. **Settings**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Healthcheck Path**: `/api/health`

5. Добавьте PostgreSQL:
   - В проекте: **"New"** → **"Database"** → **"Add PostgreSQL"**
   - Railway автоматически добавит `DATABASE_URL`

6. Добавьте переменные окружения:
   ```
   NODE_ENV=production
   ```

### 2. Frontend

1. В том же проекте: **"New"** → **"GitHub Repo"**
2. Выберите тот же репозиторий **VAZ**
3. **Settings**:
   - **Root Directory**: оставьте пустым
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

4. Добавьте переменные окружения:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=${{backend.RAILWAY_PUBLIC_DOMAIN}}
   ```

### 3. Готово!

После деплоя получите URLs:
- Backend: `https://vaz-backend-production.up.railway.app`
- Frontend: `https://vaz-frontend-production.up.railway.app`

## Структура проекта

```
VAZ/
├── backend/              # NestJS API
│   ├── src/
│   ├── package.json
│   └── railway.json     # Railway config для backend
├── app/                 # Next.js pages
├── components/          # React components
├── package.json         # Frontend dependencies
└── railway.json         # Railway config для frontend
```

## Переменные окружения

### Backend:
- `NODE_ENV=production` (обязательно)
- `DATABASE_URL` (автоматически из PostgreSQL)
- `PORT` (автоматически Railway)

### Frontend:
- `NODE_ENV=production`
- `NEXT_PUBLIC_API_URL` (URL backend с Railway)

## Мониторинг

### Логи:
1. Откройте сервис в Railway
2. Вкладка **"Deployments"**
3. Кликните на последний деплой
4. **"View Logs"**

### Метрики:
- CPU usage
- Memory usage
- Network traffic

## Стоимость

- **$5/месяц** бесплатных кредитов
- Достаточно для MVP (~500 часов)

## Обновление

Каждый push в `main` автоматически деплоится!

```bash
git add .
git commit -m "Update"
git push
```

## Troubleshooting

### Backend не запускается:
- Проверьте логи деплоя
- Убедитесь что `DATABASE_URL` установлена
- Проверьте что healthcheck работает: `/api/health`

### Frontend не подключается:
- Проверьте `NEXT_PUBLIC_API_URL`
- Должен быть полный URL backend

### База данных:
- Railway автоматически создаёт и подключает PostgreSQL
- Переменная `DATABASE_URL` добавляется автоматически

## Поддержка

- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Twitter: @Railway
