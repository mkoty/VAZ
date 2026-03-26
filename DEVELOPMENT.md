# 🛠️ Локальная разработка с Railway PostgreSQL

## Быстрый старт

### 1. Клонирование и установка

```bash
git clone https://github.com/mkoty/VAZ.git
cd VAZ
npm install
cd backend && npm install && cd ..
```

### 2. Настройка Backend

Скопируйте **DATABASE_PUBLIC_URL** из Railway PostgreSQL:

1. Откройте https://railway.app
2. Ваш проект → PostgreSQL сервис
3. **"Connect"** → скопируйте **DATABASE_PUBLIC_URL**

Создайте `backend/.env`:

```bash
cd backend
cp .env.example .env
```

Откройте `backend/.env` и вставьте DATABASE_PUBLIC_URL:

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:ваш_пароль@gondola.proxy.rlwy.net:59589/railway
```

### 3. Настройка Frontend

Создайте `.env.local` в корне проекта:

```bash
cd ..  # Вернуться в корень
cp .env.example .env.local
```

`.env.local` уже настроен правильно:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Запуск

**Терминал 1 - Backend:**
```bash
cd backend
npm run start:dev
```

Backend: http://localhost:3001
Health: http://localhost:3001/api/health

**Терминал 2 - Frontend:**
```bash
npm run dev
```

Frontend: http://localhost:3000

---

## База данных (Railway PostgreSQL)

### Преимущества:
- ✅ Не нужно устанавливать PostgreSQL локально
- ✅ Общая база для всей команды
- ✅ Одинаковые данные на dev и production

### TypeORM Auto-Sync

Backend автоматически создаёт таблицы при запуске (в development):

```typescript
synchronize: NODE_ENV !== 'production'  // true в dev
```

При первом запуске TypeORM создаст все таблицы в Railway PostgreSQL.

### Просмотр данных

**Через psql:**
```bash
psql postgresql://postgres:password@gondola.proxy.rlwy.net:59589/railway
```

**Через GUI:**
- TablePlus: https://tableplus.com
- DBeaver: https://dbeaver.io

---

## API Endpoints

### Health
```
GET http://localhost:3001/api/health
```

### Auth
```
POST /api/auth/phone
POST /api/auth/phone/verify
POST /api/auth/email
POST /api/auth/email/verify
```

### Users
```
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

### Appeals
```
GET    /api/appeals
POST   /api/appeals
GET    /api/appeals/:id
```

---

## Структура проекта

```
VAZ/
├── backend/               # NestJS Backend
│   ├── src/
│   │   ├── auth/         # Lecar ID интеграция
│   │   ├── users/        # Управление пользователями
│   │   ├── appeals/      # Обращения
│   │   └── health/       # Healthcheck
│   ├── .env              # Локальные переменные
│   └── package.json
│
├── app/                  # Next.js Pages
│   ├── page.tsx          # Главная
│   ├── auth/             # Авторизация
│   └── api/              # API Routes
│
├── components/           # React компоненты
├── lib/                  # Утилиты
└── .env.local           # Frontend переменные
```

---

## Переменные окружения

### Backend (`backend/.env`)
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:...@gondola.proxy.rlwy.net:59589/railway
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Полезные команды

### Backend
```bash
cd backend
npm run start:dev      # Dev с hot-reload
npm run build          # Production build
npm start              # Запуск production
```

### Frontend
```bash
npm run dev            # Dev сервер
npm run build          # Production build
npm start              # Запуск production
npm run lint           # Проверка кода
```

---

## Troubleshooting

### Backend не запускается

**Cannot connect to database:**
- Проверьте DATABASE_URL в `backend/.env`
- Проверьте что Railway PostgreSQL запущен

**Port 3001 already in use:**
```bash
lsof -i :3001
kill -9 <PID>
```

### Frontend не подключается

- Проверьте http://localhost:3001/api/health
- Проверьте NEXT_PUBLIC_API_URL в `.env.local`

---

## Деплой

После разработки:

```bash
git add .
git commit -m "Описание изменений"
git push
```

Railway автоматически задеплоит! 🚀

---

## Полезные ссылки

- [NestJS Docs](https://docs.nestjs.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Railway Docs](https://docs.railway.app)
- [TypeORM Docs](https://typeorm.io)
