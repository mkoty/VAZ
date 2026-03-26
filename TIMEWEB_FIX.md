# Исправление деплоя Frontend на Timeweb

## Проблема
Стили не загружаются, JavaScript файлы возвращают ошибки.

## Решение

### 1. В настройках приложения на Timeweb Cloud:

#### Фреймворк:
- **Node.js** (НЕ React!)

#### Команда сборки:
```bash
npm install && npm run build:timeweb
```

#### Директория сборки:
**ОСТАВЬТЕ ПУСТЫМ** - не указывайте ничего!

#### Переменные окружения:
```env
NODE_ENV=production
DEPLOY_TARGET=timeweb
NEXT_PUBLIC_API_URL=https://mkoty-vaz-8c2f.twc1.net
PORT=3000
```

### 2. Закоммитьте изменения:

```bash
git add .
git commit -m "Fix Timeweb deployment configuration"
git push
```

### 3. Перезапустите деплой на Timeweb

Нажмите "Redeploy" или дождитесь автоматического деплоя после push.

## Что должно произойти:

1. ✅ Timeweb установит все зависимости
2. ✅ Запустит `npm run build:timeweb`
3. ✅ Запустит `npm start` (который запускает `next start`)
4. ✅ Next.js сервер запустится на порту 3000
5. ✅ Стили и JS должны загружаться правильно

## Проверка в логах Timeweb:

Ищите строки:
```
> Ready on http://0.0.0.0:3000
```

или

```
- ready started server on 0.0.0.0:3000
```

## Если всё ещё не работает:

### Проверьте в панели Timeweb:

1. **Логи сборки** - должна быть строка `✓ Compiled successfully`
2. **Логи приложения** - должен быть запущен Next.js сервер
3. **Переменные окружения** - все 4 переменные установлены

### Откройте DevTools в браузере:

1. Нажмите F12
2. Перейдите на вкладку **Network**
3. Обновите страницу (Ctrl+R / Cmd+R)
4. Проверьте:
   - Статус код файлов CSS/JS должен быть **200**, а не 404
   - Content-Type должен быть `text/css` для CSS и `application/javascript` для JS

## Важно!

❌ **НЕ указывайте** директорию сборки как `.next` или `/`
✅ **Используйте** Node.js runtime, а не React
✅ **Запускайте** через `npm start`, а не статическую раздачу
