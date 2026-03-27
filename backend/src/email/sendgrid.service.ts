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
      console.warn('⚠️ SENDGRID_API_KEY не настроен. SendGrid email отправка отключена.');
    }
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    const fromEmail = this.configService.get<string>('SENDGRID_FROM_EMAIL') || 
                      this.configService.get<string>('EMAIL_USER') ||
                      'noreply@lada.ru';

    const msg = {
      to: email,
      from: fromEmail,
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
          <p style="color: #666; font-size: 12px;">Если вы не запрашивали этот код, проигнорируйте это письмо.</p>
        </div>
      `,
      text: `Ваш код подтверждения LADA ID: ${code}. Код действителен в течение 10 минут.`,
    };

    try {
      await sgMail.send(msg);
      console.log(`✅ Код верификации отправлен на ${email} через SendGrid`);
    } catch (error: any) {
      console.error('❌ Ошибка SendGrid:', error);
      if (error.response) {
        console.error('Детали ошибки SendGrid:', error.response.body);
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to send verification email via SendGrid: ${message}`);
    }
  }

  async sendAppealConfirmation(email: string, appealNumber: string): Promise<void> {
    const fromEmail = this.configService.get<string>('SENDGRID_FROM_EMAIL') || 
                      this.configService.get<string>('EMAIL_USER') ||
                      'noreply@lada.ru';

    const msg = {
      to: email,
      from: fromEmail,
      subject: 'Обращение принято',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #003366;">Обращение успешно создано</h2>
          <p>Ваше обращение успешно зарегистрировано и будет рассмотрено в ближайшее время.</p>
          <p>Регистрационный номер вашего обращения:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; 
                      font-size: 24px; font-weight: bold; margin: 20px 0;">
            ${appealNumber}
          </div>
          <p style="color: #666;">Мы свяжемся с вами в ближайшее время для уточнения деталей.</p>
          <p style="color: #666;">С уважением,<br/>Команда LADA</p>
        </div>
      `,
      text: `Обращение успешно создано. Регистрационный номер: ${appealNumber}.`,
    };

    try {
      await sgMail.send(msg);
      console.log(`✅ Подтверждение обращения отправлено на ${email} через SendGrid`);
    } catch (error: any) {
      console.error('❌ Ошибка SendGrid:', error);
      if (error.response) {
        console.error('Детали ошибки SendGrid:', error.response.body);
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to send appeal confirmation via SendGrid: ${message}`);
    }
  }
}
