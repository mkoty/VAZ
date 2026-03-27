# 🚀 Быстрая настройка GitHub Pages

## Шаг 1: Включить GitHub Pages

1. Откройте ваш репозиторий на GitHub
2. Перейдите в `Settings` (⚙️ Настройки)
3. В левом меню выберите `Pages`
4. В разделе **Build and deployment**:
   - **Source**: выберите `GitHub Actions`
5. Сохраните изменения

## Шаг 2: Push в GitHub

```bash
git push origin main
```

## Шаг 3: Дождитесь деплоя

1. Откройте вкладку `Actions` в вашем репозитории
2. Увидите запущенный workflow `Deploy to GitHub Pages`
3. Дождитесь завершения (обычно 1-2 минуты)
4. Если появились ✅ зеленые галочки - деплой успешен!

## Шаг 4: Откройте сайт

После успешного деплоя сайт будет доступен по адресу:

```
https://[ваш-github-username].github.io/VAZ
```

Например, если ваш username `mkoty`, то:
```
https://mkoty.github.io/VAZ
```

## ✅ Готово!

Теперь при каждом push в ветку `main` сайт будет автоматически обновляться.

## 🔧 Что уже настроено

- ✅ GitHub Actions workflow (`.github/workflows/deploy.yml`)
- ✅ Статический экспорт Next.js (`next.config.ts`)
- ✅ Production backend URL (Railway)
- ✅ CORS на backend для GitHub Pages
- ✅ Переменные окружения (`.env.production`)

## 🐛 Если что-то не работает

### Workflow падает с ошибкой

1. Откройте `Actions` → кликните на упавший workflow
2. Посмотрите логи ошибки
3. Частые причины:
   - Нет прав на деплой → проверьте Settings → Pages
   - Ошибка сборки → проверьте TypeScript ошибки локально

### Сайт не открывается (404)

1. Проверьте, что GitHub Pages включен в Settings
2. Проверьте, что выбран Source: `GitHub Actions`
3. Подождите 1-2 минуты после деплоя

### Backend недоступен

1. Проверьте, что Railway backend работает:
   ```
   https://vaz-backend-production-8550.up.railway.app
   ```
2. Если backend не отвечает - проверьте Railway dashboard

## 📚 Дополнительная документация

- [DEPLOY.md](DEPLOY.md) - Полная инструкция по деплою
- [README.md](README.md) - Общая информация о проекте

## 🆘 Нужна помощь?

Откройте issue в репозитории с описанием проблемы и скриншотом ошибки.
