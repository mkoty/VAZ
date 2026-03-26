const nodemailer = require('nodemailer');
require('dotenv').config();

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const isYandex = emailUser?.includes('@yandex');

console.log('📧 Тестируем отправку email...');
console.log('Email:', emailUser);
console.log('Провайдер:', isYandex ? 'Yandex' : 'Gmail');
console.log('Host:', isYandex ? 'smtp.yandex.ru' : 'smtp.gmail.com');
console.log('Port:', isYandex ? 465 : 587);
console.log('Secure:', isYandex);

const transporter = nodemailer.createTransport({
  host: isYandex ? 'smtp.yandex.ru' : 'smtp.gmail.com',
  port: isYandex ? 465 : 587,
  secure: isYandex,
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
  debug: true,
  logger: true,
});

// Проверяем подключение
console.log('\n🔍 Проверяем подключение к SMTP...');
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Ошибка подключения:', error);
    process.exit(1);
  } else {
    console.log('✅ SMTP сервер готов к отправке писем');

    // Отправляем тестовое письмо
    console.log('\n📨 Отправляем тестовое письмо...');
    const mailOptions = {
      from: emailUser,
      to: emailUser, // отправляем самому себе
      subject: 'Тест отправки LADA ID',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #003366;">Тест отправки email</h2>
          <p>Если вы получили это письмо, значит отправка email работает корректно! ✅</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
            1234
          </div>
          <p style="color: #666;">Тестовый код верификации LADA ID</p>
        </div>
      `,
      text: 'Тест отправки email для LADA ID. Тестовый код: 1234',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Ошибка отправки:', error);
        process.exit(1);
      } else {
        console.log('✅ Письмо успешно отправлено!');
        console.log('Message ID:', info.messageId);
        console.log('Проверьте почту:', emailUser);
        process.exit(0);
      }
    });
  }
});
