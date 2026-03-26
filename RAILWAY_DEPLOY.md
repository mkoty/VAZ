# 🚄 Railway.app - Самый быстрый деплой! (2 минуты)

## 🎯 Почему Railway?

- ✅ **$5 бесплатно** каждый месяц (достаточно для MVP!)
- ✅ **Деплой за 2 минуты** - самый быстрый!
- ✅ **Не тормозит** в отличие от Render
- ✅ PostgreSQL **в 1 клик**
- ✅ Автоматический HTTPS
- ✅ Простой как Vercel, но с backend

---

## 🚀 Быстрый старт (2 минуты!)

### Шаг 1: Создание аккаунта (30 секунд)

1. Перейдите на https://railway.app
2. Нажмите **"Start a New Project"** → **"Login with GitHub"**
3. Авторизуйте Railway

✅ **$5 кредитов** автоматически начислены!

---

### Шаг 2: Деплой Backend + PostgreSQL (1 минута)

1. В Railway нажмите **"New Project"**
2. Выберите **"Deploy from GitHub repo"**
3. Выберите репозиторий **"VAZ"**
4. Railway автоматически определит Node.js проект

#### Настройка Backend:

1. **Root Directory**: укажите `backend`
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npm start`

4. Нажмите **"Add variables"** и добавьте:
   ```
   NODE_ENV=production
   PORT=3001
   ```

5. Нажмите **"Deploy"**

#### Добавление PostgreSQL:

1. В том же проекте нажмите **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway автоматически создаст БД и добавит `DATABASE_URL`
3. **Готово!** Backend автоматически подключится к БД

⏱️ Займёт ~2-3 минуты

---

### Шаг 3: Деплой Frontend (1 минута)

#### Вариант A: Vercel (рекомендую для Next.js)

1. Перейдите на https://vercel.com
2. Нажмите **"Add New"** → **"Project"**
3. Импортируйте репозиторий **"VAZ"**
4. Vercel автоматически определит Next.js
5. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://ваш-backend.up.railway.app
   ```
   (Скопируйте URL backend из Railway)

6. Нажмите **"Deploy"**

⏱️ Займёт ~2 минуты

#### Вариант B: Railway (всё в одном месте)

1. В Railway нажмите **"New Service"** → **"GitHub Repo"**
2. Выберите тот же репозиторий **"VAZ"**
3. **Root Directory**: оставьте пустым (корень проекта)
4. **Build Command**: `npm install && npm run build`
5. **Start Command**: `npm start`
6. **Environment Variables**:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=${{backend.RAILWAY_PUBLIC_DOMAIN}}
   ```

7. Нажмите **"Deploy"**

---

## 🎉 Готово!

Ваше приложение доступно:
- **Backend**: `https://vaz-backend-production.up.railway.app`
- **Frontend** (Vercel): `https://vaz.vercel.app`
- **Frontend** (Railway): `https://vaz-frontend-production.up.railway.app`

---

## 📊 Мониторинг использования

### Проверка кредитов:
1. В Railway откройте **"Settings"** → **"Usage"**
2. Смотрите использование $5 бесплатных кредитов

### Сколько хватит $5:
- Backend + PostgreSQL: ~500 часов в месяц
- Для MVP хватит на весь месяц!

---

## ⚡ Автоматический деплой

После настройки, каждый push в `main` автоматически деплоится!

```bash
git add .
git commit -m "Update"
git push
```

Railway и Vercel автоматически пересоберут приложения.

---

## 🔧 Полезные команды Railway CLI (опционально)

### Установка CLI:
```bash
npm i -g @railway/cli
```

### Команды:
```bash
railway login              # Вход
railway status             # Статус проекта
railway logs               # Логи
railway open               # Открыть в браузере
railway variables          # Показать переменные
```

---

## 💰 Стоимость после бесплатных кредитов

| Компонент | Бесплатно | Платно |
|-----------|-----------|--------|
| Hobby Plan | $5/мес кредитов | $5/мес (pay-as-you-go) |
| Использование | ~500 часов/мес | ~$0.01/час |
| PostgreSQL | Включено | Включено |
| Трафик | Включено | Включено |

**Для MVP**: Бесплатных $5 хватит на весь месяц!

---

## 🐛 Troubleshooting

### Backend не запускается:

1. Проверьте логи в Railway:
   - Откройте ваш backend сервис
   - Вкладка **"Deployments"** → кликните на последний деплой
   - Смотрите **"Build Logs"** и **"Deploy Logs"**

2. Проверьте переменные окружения:
   - `DATABASE_URL` должна быть автоматически добавлена
   - `NODE_ENV=production`
   - `PORT=3001` (или оставьте пустым - Railway сам установит)

### Frontend не подключается к Backend:

1. Проверьте `NEXT_PUBLIC_API_URL`:
   - Должен быть полный URL: `https://your-backend.up.railway.app`
   - **НЕ** забудьте `https://` в начале

2. Проверьте CORS на backend (у вас уже настроено `origin: true`)

3. Перезапустите frontend после изменения переменных

### База данных не подключается:

1. Убедитесь что PostgreSQL сервис создан в Railway
2. Railway автоматически добавляет `DATABASE_URL` - проверьте что она есть
3. Проверьте логи backend на наличие ошибок подключения к БД

---

## 🔒 Custom Domain (опционально)

### На Railway:
1. Откройте сервис → **"Settings"** → **"Networking"**
2. **"Custom Domain"** → добавьте ваш домен
3. Настройте CNAME запись у вашего DNS провайдера

### На Vercel:
1. **"Settings"** → **"Domains"**
2. Добавьте домен
3. Настройте DNS (Vercel покажет инструкцию)

---

## 📈 Масштабирование (когда вырастите)

### Railway:
- **Pro Plan**: $20/мес - приоритетная поддержка, больше ресурсов
- Автоматическое масштабирование

### Vercel:
- **Pro Plan**: $20/мес - больше трафика, команды
- Edge Functions для ещё большей скорости

---

## ✅ Checklist после деплоя

- [ ] Backend развёрнут на Railway
- [ ] PostgreSQL создана и подключена
- [ ] Frontend развёрнут на Vercel/Railway
- [ ] `NEXT_PUBLIC_API_URL` настроен правильно
- [ ] Сайт открывается и стили применены
- [ ] API запросы работают
- [ ] Проверено использование кредитов
- [ ] Автодеплой работает (сделайте тестовый commit)

---

## 🆘 Поддержка

### Railway:
- 📚 Docs: https://docs.railway.app
- 💬 Discord: https://discord.gg/railway
- 📧 Email: team@railway.app

### Vercel:
- 📚 Docs: https://vercel.com/docs
- 💬 Discord: https://vercel.com/discord
- 📧 Support: через Dashboard

---

## 🎯 Сравнение с другими вариантами

| Платформа | Скорость | Надёжность | Цена | Простота |
|-----------|----------|------------|------|----------|
| **Railway** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $5/мес | ⭐⭐⭐⭐⭐ |
| Render | ⭐⭐ | ⭐⭐⭐ | Free | ⭐⭐⭐⭐ |
| Vercel | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Free | ⭐⭐⭐⭐⭐ |
| Selectel | ⭐⭐⭐ | ⭐⭐⭐⭐ | 500₽/мес | ⭐⭐ |

---

## 🎉 Поздравляю!

Вы развернули полноценное full-stack приложение за 2 минуты! 🚀

**Следующие шаги:**
1. Поделитесь ссылкой с пользователями
2. Соберите обратную связь
3. Итерируйте MVP

Удачи! 💪
