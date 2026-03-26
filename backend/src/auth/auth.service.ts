import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private emailService: EmailService,
  ) {}

  // Mock OTP storage (в продакшене использовать Redis)
  private otpStorage = new Map<string, string>();

  async requestCode(contact: string, method: 'phone' | 'email') {
    const user = method === 'phone'
      ? await this.usersService.findByPhone(contact)
      : await this.usersService.findByEmail(contact);

    // Генерируем код
    const code = this.generateOTP();
    this.otpStorage.set(contact, code);

    // Отправляем код на email (всегда используем email для верификации)
    const email = method === 'email' ? contact : user?.email;
    if (email) {
      try {
        await this.emailService.sendVerificationCode(email, code);
        console.log(`✅ Код отправлен на email ${email}`);
      } catch (error) {
        console.error(`❌ Ошибка отправки email: ${error.message}`);
        // Для разработки продолжаем работу даже если email не отправлен
        console.log(`📱 OTP для ${contact}: ${code}`);
      }
    } else {
      console.log(`📱 OTP для ${contact}: ${code}`);
    }

    return {
      success: true,
      userExists: !!user,
      message: 'Код отправлен',
    };
  }

  async verifyCode(contact: string, code: string, method: 'phone' | 'email') {
    const storedCode = this.otpStorage.get(contact);

    if (!storedCode || storedCode !== code) {
      throw new BadRequestException('Неверный код');
    }

    this.otpStorage.delete(contact);

    const user = method === 'phone'
      ? await this.usersService.findByPhone(contact)
      : await this.usersService.findByEmail(contact);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        phone: user.phone,
        email: user.email,
      },
      token: this.generateToken(user.id),
    };
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
  }) {
    // Генерируем код
    const contact = userData.phone || userData.email;
    const code = this.generateOTP();
    this.otpStorage.set(contact, code);

    // Отправляем код на email (если указан)
    if (userData.email) {
      try {
        await this.emailService.sendVerificationCode(userData.email, code);
        console.log(`✅ Код регистрации отправлен на ${userData.email}`);
      } catch (error) {
        console.error(`❌ Ошибка отправки email: ${error.message}`);
        console.log(`📱 Регистрация OTP для ${contact}: ${code}`);
      }
    } else {
      console.log(`📱 Регистрация OTP для ${contact}: ${code}`);
    }

    return {
      success: true,
      message: 'Код подтверждения отправлен',
    };
  }

  async confirmRegistration(userData: {
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
    code: string;
  }) {
    const contact = userData.phone || userData.email;
    const storedCode = this.otpStorage.get(contact);

    if (!storedCode || storedCode !== userData.code) {
      throw new BadRequestException('Неверный код');
    }

    this.otpStorage.delete(contact);

    const user = await this.usersService.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      email: userData.email,
      isVerified: true,
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        phone: user.phone,
        email: user.email,
      },
      token: this.generateToken(user.id),
    };
  }

  private generateOTP(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  private generateToken(userId: string): string {
    // В продакшене использовать JWT
    return `mock-token-${userId}-${Date.now()}`;
  }
}
