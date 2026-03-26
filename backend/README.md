# AvtoVAZ Reception Backend (NestJS)

API сервер для интернет-приемной АвтоВАЗ

## Технологии

- **NestJS** - фреймворк
- **TypeORM** - ORM для PostgreSQL
- **PostgreSQL** - база данных
- **TypeScript** - язык программирования

## Структура

```
src/
├── auth/           # Авторизация (Lecar ID)
├── users/          # Пользователи
├── appeals/        # Обращения
├── common/         # Общие модули
├── app.module.ts   # Главный модуль
└── main.ts         # Точка входа
```

## Установка

```bash
npm install
```

## Настройка

Создайте `.env` файл на основе `.env.example`:

```bash
cp .env.example .env
```

Укажите `DATABASE_URL` для подключения к PostgreSQL.

## Запуск

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Endpoints

### Авторизация

- `POST /auth/request-code` - Запросить код
- `POST /auth/verify-code` - Проверить код и войти
- `POST /auth/register` - Регистрация
- `POST /auth/confirm-registration` - Подтверждение регистрации

### Пользователи

- `GET /users/:id` - Получить пользователя

### Обращения

- `POST /appeals` - Создать обращение
- `GET /appeals/user/:userId` - Обращения пользователя
- `GET /appeals/:id` - Получить обращение

## База данных

### Миграции

TypeORM автоматически синхронизирует схему в development режиме.

Для production используйте миграции:

```bash
npm run typeorm migration:generate -- -n InitialMigration
npm run typeorm migration:run
```

## Деплой на Timeweb Cloud

1. Создайте PostgreSQL базу данных
2. Создайте Cloud App (Node.js)
3. Подключите репозиторий
4. Настройте переменные окружения:
   - `DATABASE_URL`
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://mkoty.github.io/VAZ`
5. Build command: `npm run build`
6. Start command: `npm run start:prod`
