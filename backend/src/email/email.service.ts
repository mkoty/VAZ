import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    // Определяем провайдера (Gmail или Yandex)
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPassword = this.configService.get<string>('EMAIL_PASSWORD');
    const isYandex = emailUser?.includes('@yandex');

    if (!emailUser || !emailPassword) {
      console.warn('⚠️ EMAIL_USER или EMAIL_PASSWORD не настроены. Email отправка отключена.');
    }

    this.transporter = nodemailer.createTransport({
      host: isYandex ? 'smtp.yandex.ru' : 'smtp.gmail.com',
      port: isYandex ? 465 : 587,
      secure: isYandex, // true для Yandex (465), false для Gmail (587)
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
      debug: true, // Включаем debug режим
      logger: true, // Включаем логирование
    });

    // Проверяем подключение при старте (не блокируем запуск приложения)
    if (emailUser && emailPassword) {
      this.verifyConnection();
    }
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ SMTP сервер готов к отправке писем');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Ошибка подключения к SMTP:', message);
      console.error('Убедитесь что EMAIL_USER и EMAIL_PASSWORD настроены правильно');
    }
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: email,
      subject: 'Код подтверждения LADA ID',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #003366;">Код подтверждения LADA ID</h2>
          <p>Ваш код подтверждения:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #666;">Код действителен в течение 10 минут.</p>
          <p style="color: #666; font-size: 12px;">Если вы не запрашивали этот код, проигнорируйте это письмо.</p>
        </div>
      `,
      text: `Ваш код подтверждения LADA ID: ${code}. Код действителен в течение 10 минут.`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Код верификации отправлен на ${email}`);
      console.log('Message ID:', info.messageId);
    } catch (error) {
      console.error('❌ Ошибка отправки email:', error);
      console.error('Детали ошибки:', JSON.stringify(error, null, 2));
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to send verification email: ${message}`);
    }
  }

  async sendAppealConfirmation(email: string, appealNumber: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: email,
      subject: 'Обращение принято',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #003366;">Ваше обращение принято</h2>
          <p>Регистрационный номер вашего обращения:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
            ${appealNumber}
          </div>
          <p style="color: #666;">Мы свяжемся с вами в ближайшее время.</p>
          <p style="color: #666;">С уважением,<br/>Команда LADA</p>
        </div>
      `,
      text: `Ваше обращение принято. Регистрационный номер: ${appealNumber}. Мы свяжемся с вами в ближайшее время.`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Подтверждение обращения отправлено на ${email}`);
      console.log('Message ID:', info.messageId);
    } catch (error) {
      console.error('❌ Ошибка отправки email:', error);
      console.error('Детали ошибки:', JSON.stringify(error, null, 2));
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to send appeal confirmation: ${message}`);
    }
  }
}
