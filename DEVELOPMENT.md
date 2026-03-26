# Разработка локально

## Структура проекта

```
VAZ/
├── app/              # Next.js frontend (React)
├── backend/          # NestJS API
├── components/       # UI компоненты
├── lib/              # Утилиты и API клиент
└── public/           # Статика
```

## Запуск для разработки

### 1. Backend (NestJS API)

```bash
cd backend

# Создайте .env файл
cp .env.example .env

# Укажите DATABASE_URL (можно использовать любую PostgreSQL БД)
# Для начала можно оставить как есть - будет ошибка подключения к БД,
# но авторизация будет работать (OTP коды выводятся в консоль)

# Установите зависимости (если еще не установлены)
npm install

# Запустите в dev режиме
npm run start:dev
```

API будет доступен на `http://localhost:3001`

**OTP коды будут выводиться в консоль backend:**
```
📱 OTP для +79991234567: 8234
```

### 2. Frontend (Next.js)

```bash
# В корне проекта

# Создайте .env.local
cp .env.example .env.local

# Должно быть:
# NEXT_PUBLIC_API_URL=http://localhost:3001

# Запустите dev сервер
npm run dev
```

Frontend будет доступен на `http://localhost:3000`

## Тестирование

1. Откройте `http://localhost:3000`
2. Нажмите "Войти через Lecar ID"
3. Введите телефон или email
4. Проверьте консоль backend - там будет OTP код
5. Введите код (например: `8234`)
6. После входа заполните форму обращения

## База данных

### Локальная PostgreSQL (опционально)

Если хотите полностью протестировать с БД:

```bash
# Docker
docker run -d \
  --name avtovaz-postgres \
  -e POSTGRES_PASSWORD=dev \
  -e POSTGRES_DB=avtovaz \
  -p 5432:5432 \
  postgres:14

# В backend/.env укажите:
DATABASE_URL=postgresql://postgres:dev@localhost:5432/avtovaz
```

После запуска backend автоматически создаст таблицы (synchronize: true в dev режиме).

## Проверка работы

### Backend API

```bash
# Health check
curl http://localhost:3001

# Request OTP code
curl -X POST http://localhost:3001/auth/request-code \
  -H "Content-Type: application/json" \
  -d '{"contact": "+79991234567", "method": "phone"}'
```

### Frontend

1. Авторизация работает
2. OTP коды приходят в консоль backend
3. После входа форма обращения сохраняет данные в БД

## Troubleshooting

### Backend не запускается

- Проверьте что порт 3001 свободен
- Если ошибка подключения к БД - это нормально для начала, OTP всё равно будет работать

### Frontend не подключается к API

- Проверьте `.env.local` - должен быть `NEXT_PUBLIC_API_URL=http://localhost:3001`
- Проверьте что backend запущен
- Откройте DevTools → Network - там должны быть запросы к localhost:3001

### CORS ошибки

- Backend уже настроен для работы с localhost:3000
- Если используете другой порт - измените в `backend/src/main.ts`

## Следующие шаги

После локального тестирования:
1. Создайте PostgreSQL на Timeweb Cloud
2. Задеплойте backend на Timeweb Cloud App
3. Обновите `NEXT_PUBLIC_API_URL` на продакшн URL
4. Frontend останется на GitHub Pages или также на Timeweb
