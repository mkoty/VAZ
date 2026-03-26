# 🚀 Деплой на Render.com - Самый простой способ!

## Почему Render.com?
- ✅ **БЕСПЛАТНЫЙ** план (не нужна карта!)
- ✅ Деплой за **5 минут**
- ✅ Автоматический PostgreSQL
- ✅ Автоматический SSL (HTTPS)
- ✅ Авто-деплой при push в GitHub
- ✅ Не нужно настраивать сервер

---

## 📋 Быстрый старт (5 минут)

### Шаг 1: Регистрация на Render

1. Перейдите на https://render.com
2. Нажмите **"Get Started"**
3. Войдите через **GitHub** (рекомендуется)
4. Авторизуйте Render для доступа к вашему репозиторию

---

### Шаг 2: Деплой через Blueprint (автоматический)

**Это самый простой способ!** Render автоматически создаст все сервисы.

1. В панели Render нажмите **"New"** → **"Blueprint"**
2. Выберите ваш репозиторий **"VAZ"**
3. Render автоматически найдёт файл `render.yaml`
4. Нажмите **"Apply"**

Готово! 🎉 Render автоматически создаст:
- ✅ Backend сервис (NestJS)
- ✅ Frontend сервис (Next.js)
- ✅ PostgreSQL базу данных
- ✅ Все переменные окружения

⏱️ Первый деплой займёт ~5-7 минут

---

### Альтернатива: Ручной деплой (если Blueprint не сработал)

#### 2.1. Создание PostgreSQL базы данных

1. В панели Render нажмите **"New"** → **"PostgreSQL"**
2. Заполните:
   - **Name**: `vaz-db`
   - **Database**: `lecar_db`
   - **User**: `lecar_user`
   - **Region**: Frankfurt (ближе к России)
   - **Plan**: Free
3. Нажмите **"Create Database"**
4. **Сохраните** Internal Database URL (понадобится для backend)

#### 2.2. Деплой Backend

1. Нажмите **"New"** → **"Web Service"**
2. Выберите ваш репозиторий **"VAZ"**
3. Заполните:
   - **Name**: `vaz-backend`
   - **Region**: Frankfurt
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Environment Variables** (переменные окружения):
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=<вставьте Internal Database URL из шага 2.1>
   ```

5. Нажмите **"Create Web Service"**

#### 2.3. Деплой Frontend

1. Нажмите **"New"** → **"Web Service"**
2. Выберите ваш репозиторий **"VAZ"**
3. Заполните:
   - **Name**: `vaz-frontend`
   - **Region**: Frankfurt
   - **Branch**: `main`
   - **Root Directory**: оставьте пустым (корень проекта)
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Environment Variables**:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://vaz-backend.onrender.com
   ```

   Замените `vaz-backend.onrender.com` на реальный URL вашего backend!

5. Нажмите **"Create Web Service"**

---

## 🎯 Получение URL приложений

После деплоя у вас будут URLs:
- Backend: `https://vaz-backend.onrender.com`
- Frontend: `https://vaz-frontend.onrender.com`

### Обновите переменную окружения Frontend:

1. Откройте ваш frontend сервис в Render
2. Перейдите в **"Environment"**
3. Измените `NEXT_PUBLIC_API_URL` на реальный URL backend
4. Сохраните (Render автоматически пересоберёт)

---

## ⚡ Автоматический деплой

После настройки, каждый push в `main` автоматически задеплоит изменения!

```bash
git add .
git commit -m "Update app"
git push
```

Render автоматически:
1. Обнаружит изменения
2. Соберёт приложение
3. Задеплоит новую версию

---

## 🔍 Мониторинг и логи

### Просмотр логов:
1. Откройте сервис в панели Render
2. Перейдите на вкладку **"Logs"**
3. Смотрите логи в реальном времени

### Метрики:
1. Вкладка **"Metrics"**
2. Отслеживание CPU, Memory, Response time

---

## 🆓 Бесплатный план - ограничения

**Что входит в бесплатный план:**
- ✅ 750 часов в месяц на сервис (достаточно для 1 сервиса 24/7)
- ✅ PostgreSQL: 1GB storage, 90 дней истории
- ✅ SSL сертификаты
- ✅ Автоматический деплой

**Ограничения:**
- ⚠️ Сервисы "засыпают" после 15 минут неактивности (первый запрос ~30 сек)
- ⚠️ 100GB трафика в месяц
- ⚠️ Нет custom domains на бесплатном плане

**Для продакшна:**
- Платный план от $7/месяц за сервис
- Сервисы не засыпают
- Custom domains

---

## 🐛 Troubleshooting

### Backend не запускается:

Проверьте логи:
1. Откройте backend сервис
2. Вкладка "Logs"
3. Ищите ошибки

Частые проблемы:
- ❌ Неправильный `DATABASE_URL`
- ❌ Не установлены зависимости
- ❌ Ошибка в коде

### Frontend не загружает данные:

1. Проверьте `NEXT_PUBLIC_API_URL` - должен быть URL backend
2. Проверьте CORS на backend (у вас уже настроено `origin: true`)
3. Проверьте логи frontend

### База данных не подключается:

1. Убедитесь что используете **Internal Database URL** (не External!)
2. Проверьте что база данных создана и активна
3. Проверьте формат DATABASE_URL: `postgresql://user:pass@host:port/db`

---

## 💰 Стоимость (если решите перейти на платный план)

| Компонент | Бесплатный план | Платный план |
|-----------|----------------|--------------|
| Web Service | 750 часов/мес | $7/мес (всегда активен) |
| PostgreSQL | 1GB | $7/мес (256MB RAM) |
| **ИТОГО для MVP** | **$0** | **$21/мес** |

---

## 🔧 Полезные команды

### Локальная проверка перед деплоем:

```bash
# Backend
cd backend
npm install
npm run build
npm start

# Frontend
cd ..
npm install
npm run build
npm start
```

### Подключение к PostgreSQL на Render:

```bash
# Скачайте PSQL URL из панели Render (External Database URL)
psql <External-Database-URL>
```

---

## 🌐 Custom Domain (опционально, платный план)

Если купите домен:

1. Откройте сервис в Render
2. Перейдите в **"Settings"** → **"Custom Domain"**
3. Добавьте ваш домен
4. Настройте DNS записи (Render покажет инструкцию)

---

## ✅ Checklist после деплоя

- [ ] Backend развёрнут и доступен
- [ ] Frontend развёрнут и доступен
- [ ] PostgreSQL база создана
- [ ] `NEXT_PUBLIC_API_URL` настроен правильно
- [ ] Сайт открывается и стили применены
- [ ] API запросы работают
- [ ] Автодеплой настроен (push → автоматический деплой)

---

## 🆘 Поддержка

- 📚 Документация: https://render.com/docs
- 💬 Community: https://community.render.com
- 📧 Support: через панель управления

---

## 🎉 Готово!

Ваше приложение теперь доступно:
- Frontend: `https://vaz-frontend.onrender.com`
- Backend: `https://vaz-backend.onrender.com`

**Поделитесь ссылкой и тестируйте MVP!** 🚀
