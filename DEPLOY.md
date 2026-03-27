# Деплой на GitHub Pages

## Что настроено

### Frontend (GitHub Pages)
- ✅ Статический экспорт Next.js
- ✅ Автоматический деплой через GitHub Actions
- ✅ Подключение к production backend на Railway

### Backend (Railway)
- ✅ CORS настроен для GitHub Pages
- ✅ URL: `https://vaz-backend-production-8550.up.railway.app`

## Первоначальная настройка

### 1. Включить GitHub Pages в репозитории

1. Откройте настройки репозитория: `Settings` → `Pages`
2. В разделе **Source** выберите: `GitHub Actions`
3. Сохраните изменения

### 2. Проверить workflow

После первого push в `main` ветку:
1. Откройте вкладку `Actions` в репозитории
2. Дождитесь завершения workflow `Deploy to GitHub Pages`
3. Проверьте, что оба шага (build и deploy) успешны ✅

### 3. Получить URL приложения

После успешного деплоя приложение будет доступно по адресу:
```
https://[ваш-username].github.io/VAZ
```

Например: `https://mac.github.io/VAZ`

## Как это работает

### Автоматический деплой

При каждом push в ветку `main`:
1. GitHub Actions запускает workflow (`.github/workflows/deploy.yml`)
2. Устанавливаются зависимости (`npm ci`)
3. Собирается статический сайт с переменными окружения:
   - `DEPLOY_TARGET=github` - включает статический export
   - `NEXT_PUBLIC_API_URL` - URL backend на Railway
4. Собранные файлы из папки `out/` деплоятся на GitHub Pages

### Переменные окружения

**Production** (GitHub Pages):
- `NEXT_PUBLIC_API_URL=https://vaz-backend-production-8550.up.railway.app`

**Development** (локально):
- `NEXT_PUBLIC_API_URL=http://localhost:3001`

### Ручной деплой

Можно запустить деплой вручную:
1. Откройте `Actions` → `Deploy to GitHub Pages`
2. Нажмите `Run workflow`
3. Выберите ветку `main`
4. Нажмите `Run workflow`

## Локальная сборка для GitHub Pages

Протестировать production сборку локально:

```bash
# Собрать статический сайт
DEPLOY_TARGET=github NEXT_PUBLIC_API_URL=https://vaz-backend-production-8550.up.railway.app npm run build

# Проверить папку out/
ls -la out/

# Запустить локальный сервер для тестирования
npx serve out
```

## CORS на Backend

Backend настроен на прием запросов от:
- ✅ `http://localhost:3000` (локальная разработка)
- ✅ `https://*.github.io` (GitHub Pages - все поддомены)
- ✅ Запросы без origin (мобильные приложения)

### Обновить список разрешенных origins

Отредактируйте `backend/src/main.ts`:

```typescript
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-username.github.io', // Ваш GitHub Pages URL
  /\.github\.io$/,
  /localhost:\d+$/,
];
```

Не забудьте задеплоить backend на Railway после изменений!

## Структура проекта

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── public/
│   └── .nojekyll              # Отключить Jekyll обработку
├── .env.production            # Production переменные окружения
├── next.config.ts             # Конфигурация Next.js с basePath
└── out/                       # Собранный статический сайт (после build)
```

## Troubleshooting

### 404 при переходе по ссылкам

**Проблема**: После обновления страницы или перехода по прямой ссылке возникает 404.

**Решение**: GitHub Pages не поддерживает client-side routing. Добавьте `404.html`:

```bash
cp out/index.html out/404.html
```

Это уже настроено в workflow автоматически.

### Стили не загружаются

**Проблема**: CSS/JS не загружаются, в консоли ошибки 404.

**Решение**: Проверьте `basePath` в `next.config.ts`:

```typescript
basePath: process.env.DEPLOY_TARGET === 'github' ? '/VAZ' : '',
```

Название репозитория должно совпадать с `basePath` (чувствителен к регистру).

### Backend недоступен

**Проблема**: Запросы к API возвращают CORS ошибки или network errors.

**Решение**:
1. Проверьте, что backend на Railway работает
2. Проверьте CORS настройки в `backend/src/main.ts`
3. Убедитесь, что переменная `NEXT_PUBLIC_API_URL` правильно установлена в workflow

### Workflow падает с ошибкой

**Проблема**: GitHub Actions workflow завершается с ошибкой.

**Решение**:
1. Откройте `Actions` → выберите упавший workflow
2. Посмотрите логи для определения причины
3. Частые причины:
   - Ошибка сборки Next.js (проверьте TypeScript ошибки)
   - Недостаточно прав для деплоя (проверьте `Settings` → `Pages`)
   - Неправильные переменные окружения

## Полезные команды

```bash
# Локальная разработка
npm run dev

# Production сборка для GitHub Pages
npm run build:github

# Проверить собранный сайт
npx serve out

# Очистить кэш и пересобрать
rm -rf .next out node_modules
npm install
npm run build:github
```

## Ссылки

- **GitHub Pages**: https://[username].github.io/VAZ
- **Backend (Railway)**: https://vaz-backend-production-8550.up.railway.app
- **GitHub Actions**: https://github.com/[username]/VAZ/actions
- **Next.js Static Export**: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
