# Интернет-приемная АвтоВАЗ

MVP интернет-приемной ПАО «АвтоВАЗ» с авторизацией через Lecar ID.

## Технологии

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Backend**: NestJS + TypeORM + PostgreSQL
- **UI**: shadcn/ui + Tailwind CSS
- **Email**: Nodemailer (SMTP)
- **Деплой**:
  - Frontend: GitHub Pages
  - Backend: Railway

## Функционал

- ✅ Авторизация через Lecar ID (email/телефон)
- ✅ OTP верификация через email
- ✅ Регистрация новых пользователей
- ✅ Форма подачи обращения
- ✅ Категории обращений
- ✅ Email уведомления
- ✅ Визуальный стиль LADA
- ✅ Адаптивный дизайн (включая мобильные устройства)

## 🚀 Быстрый старт

### Frontend (локально)

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev
# Откроется http://localhost:3000
```

### Backend (локально)

```bash
cd backend

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev
# API доступно на http://localhost:3001
```

Подробнее в [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md)

## 📱 Тестирование с мобильных устройств

См. [MOBILE_QUICK_START.md](MOBILE_QUICK_START.md) и [MOBILE_TESTING.md](MOBILE_TESTING.md)

## 🌐 Деплой на GitHub Pages

### Первоначальная настройка

1. **Включить GitHub Pages**:
   - `Settings` → `Pages` → `Source`: `GitHub Actions`

2. **Push в main ветку**:
   ```bash
   git push origin main
   ```

3. **Проверить деплой**:
   - Откройте `Actions` → `Deploy to GitHub Pages`
   - Дождитесь завершения ✅

4. **Открыть сайт**:
   - `https://[ваш-username].github.io/VAZ`

### Автоматический деплой

При каждом push в `main`:
- ✅ Собирается статический сайт
- ✅ Подключается к production backend на Railway
- ✅ Деплоится на GitHub Pages

Подробнее в [DEPLOY.md](DEPLOY.md)

## 📂 Структура проекта

```
.
├── app/                      # Next.js App Router
│   ├── auth/                 # Страница авторизации/регистрации
│   ├── page.tsx              # Главная страница (форма обращения)
│   ├── layout.tsx            # Layout приложения
│   └── globals.css           # Глобальные стили
├── backend/                  # NestJS Backend
│   ├── src/
│   │   ├── auth/             # Модуль авторизации (Lecar ID)
│   │   ├── users/            # Модуль пользователей
│   │   ├── appeals/          # Модуль обращений
│   │   └── email/            # Модуль отправки email
│   └── package.json
├── components/
│   └── ui/                   # UI компоненты (shadcn/ui)
├── lib/
│   ├── api.ts                # API клиент
│   └── utils.ts              # Утилиты
├── .github/workflows/
│   └── deploy.yml            # GitHub Actions для деплоя
├── public/
│   └── .nojekyll             # Отключение Jekyll на GitHub Pages
├── .env.production           # Production переменные окружения
├── DEPLOY.md                 # Полная документация по деплою
├── MOBILE_TESTING.md         # Тестирование с мобильных устройств
└── next.config.ts            # Конфигурация Next.js
```

## 🔗 Ссылки

- **Frontend (GitHub Pages)**: https://[username].github.io/VAZ
- **Backend (Railway)**: https://vaz-backend-production-8550.up.railway.app
- **Документация**: См. файлы `*.md` в корне проекта

## 📖 Документация

- [DEPLOY.md](DEPLOY.md) - Полная инструкция по деплою на GitHub Pages
- [MOBILE_TESTING.md](MOBILE_TESTING.md) - Тестирование на реальных мобильных устройствах
- [MOBILE_QUICK_START.md](MOBILE_QUICK_START.md) - Быстрый старт для мобильного тестирования
- [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md) - Локальная разработка
- [CLAUDE.md](CLAUDE.md) - Описание алгоритма Lecar ID
