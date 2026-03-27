# 🔧 Исправление: Connection Timeout на Railway

## Проблема
```
❌ Ошибка отправки email: Error: Connection timeout
code: 'ETIMEDOUT'
command: 'CONN'
```

## Причина
Railway блокирует или ограничивает подключение к некоторым SMTP серверам:
- Порт 465 (SSL) может быть заблокирован
- Yandex SMTP может быть недоступен с Railway серверов

## ✅ Решение 1: Исправлен код (использовать порт 587)

Обновлен `backend/src/email/email.service.ts`:
- Использует порт 587 вместо 465
- Включен STARTTLS вместо прямого SSL
- Увеличены таймауты подключения

### Деплой обновления

```bash
# В папке backend:
git add .
git commit -m "Fix SMTP connection timeout on Railway"
git push origin main
```

Railway автоматически задеплоит обновление.

## ✅ Решение 2: Использовать Gmail (Рекомендуется)

Gmail работает более стабильно на Railway.

### Шаг 1: Создайте App Password в Gmail

1. Откройте: https://myaccount.google.com/apppasswords
2. Включите 2FA (двухфакторную аутентификацию), если не включена
3. Нажмите "Create" → выберите "Mail" и "Other (Custom name)"
4. Введите "LADA Backend Railway"
5. Скопируйте 16-значный пароль (например: `abcd efgh ijkl mnop`)

### Шаг 2: Обновите переменные на Railway

Railway Dashboard → Variables:

```
EMAIL_USER=ваша-почта@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

**Важно:** Вставьте пароль БЕЗ пробелов (уберите пробелы из `abcd efgh ijkl mnop`)

### Шаг 3: Перезапустите сервис

Railway автоматически перезапустится после изменения переменных.

### Шаг 4: Проверьте логи

Должно быть:
```
✅ SMTP сервер готов к отправке писем
```

## ✅ Решение 3: Использовать SendGrid (Профессиональное решение)

SendGrid - это email сервис, который отлично работает на Railway.

### Преимущества:
- ✅ 100 писем/день бесплатно
- ✅ Стабильная доставка
- ✅ Детальная аналитика
- ✅ Не требует паролей приложений

### Шаг 1: Регистрация

1. Зарегистрируйтесь: https://signup.sendgrid.com/
2. Подтвердите email
3. Создайте API ключ: Settings → API Keys → Create API Key
4. Выберите "Full Access"
5. Скопируйте ключ (он показывается один раз!)

### Шаг 2: Установите пакет

```bash
cd backend
npm install @sendgrid/mail
```

### Шаг 3: Создайте SendGrid сервис

Создайте файл `backend/src/email/sendgrid.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (apiKey) {
      sgMail.setApiKey(apiKey);
      console.log('✅ SendGrid инициализирован');
    } else {
      console.warn('⚠️ SENDGRID_API_KEY не настроен');
    }
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    const msg = {
      to: email,
      from: this.configService.get<string>('EMAIL_FROM') || 'noreply@yourdomain.com',
      subject: 'Код подтверждения LADA ID',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #003366;">Код подтверждения LADA ID</h2>
          <p>Ваш код подтверждения:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; 
                      font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #666;">Код действителен в течение 10 минут.</p>
        </div>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log(`✅ Код отправлен на ${email} через SendGrid`);
    } catch (error) {
      console.error('❌ Ошибка SendGrid:', error);
      throw error;
    }
  }
}
```

### Шаг 4: Обновите переменные на Railway

```
SENDGRID_API_KEY=ваш-api-ключ
EMAIL_FROM=noreply@yourdomain.com
```

### Шаг 5: Используйте SendGrid в auth.service.ts

Замените `emailService.sendVerificationCode()` на `sendGridService.sendVerificationCode()`.

## 🧪 Проверка решения

### 1. Проверьте логи Railway

```
Deployments → View Logs
```

Ищите:
```
✅ SMTP сервер готов к отправке писем
```

или

```
❌ Ошибка подключения к SMTP: ...
```

### 2. Протестируйте отправку кода

1. Откройте приложение на GitHub Pages
2. Запросите код
3. Проверьте логи Railway:

```
🔍 Поиск пользователя email=test@example.com
🆕 Сгенерирован новый код
✅ Код отправлен на email test@example.com
```

### 3. Проверьте почту

Письмо должно прийти в течение 1-2 минут.

## 📊 Сравнение решений

| Решение | Сложность | Стабильность | Стоимость |
|---------|-----------|--------------|-----------|
| Yandex (порт 587) | ⭐ | ⭐⭐ | Бесплатно |
| Gmail | ⭐⭐ | ⭐⭐⭐ | Бесплатно |
| SendGrid | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Бесплатно до 100/день |

## 🆘 Если ничего не помогло

1. **Проверьте переменные окружения:**
   - Railway → Variables
   - Нет лишних пробелов
   - EMAIL_PASSWORD без пробелов

2. **Проверьте пароль приложения:**
   - Создайте новый пароль приложения
   - Убедитесь что используете пароль приложения, а не обычный

3. **Попробуйте другой email провайдер:**
   - Используйте Gmail вместо Yandex
   - Или используйте SendGrid

4. **Проверьте Railway Dashboard:**
   - Settings → Check Logs
   - Убедитесь что деплой успешен

## ✅ Рекомендация

**Для production используйте Gmail или SendGrid** - они работают стабильнее на хостингах.

Yandex может работать нестабильно из-за:
- Блокировки портов
- Географических ограничений
- Rate limiting

---

После применения любого из решений:
1. Закоммитьте изменения
2. Push в GitHub
3. Railway автоматически задеплоит
4. Проверьте логи через 2-3 минуты
