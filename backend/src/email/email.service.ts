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
    const isYandex = emailUser?.includes('@yandex');

    this.transporter = nodemailer.createTransport({
      host: isYandex ? 'smtp.yandex.ru' : 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: emailUser,
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
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
      await this.transporter.sendMail(mailOptions);
      console.log(`Verification code sent to ${email}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send verification email');
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
      await this.transporter.sendMail(mailOptions);
      console.log(`Appeal confirmation sent to ${email}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send appeal confirmation email');
    }
  }
}
