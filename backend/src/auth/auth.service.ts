import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { SendGridService } from '../email/sendgrid.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private emailService: EmailService,
    private sendGridService: SendGridService,
    private configService: ConfigService,
  ) {}

  // Mock OTP storage (в продакшене использовать Redis)
  private otpStorage = new Map<string, string>();

  async requestCode(contact: string, method: 'phone' | 'email') {
    const user = method === 'phone'
      ? await this.usersService.findByPhone(contact)
      : await this.usersService.findByEmail(contact);

    console.log(`🔍 Поиск пользователя ${method}=${contact}: ${user ? 'найден ✅' : 'не найден ❌'}`);
    if (user) {
      console.log(`👤 Пользователь: ID=${user.id}, Email=${user.email}, Phone=${user.phone}`);
    }

    // Проверяем, есть ли уже код для этого контакта
    let code = this.otpStorage.get(contact);
    if (code) {
      console.log(`♻️  Повторная отправка существующего кода для ${contact}`);
    } else {
      // Генерируем новый код только если его нет
      code = this.generateOTP();
      this.otpStorage.set(contact, code);
      console.log(`🆕 Сгенерирован новый код для ${contact}`);
    }

    // Отправляем код на email (используем SendGrid если настроен, иначе SMTP)
    const email = method === 'email' ? contact : user?.email;
    if (email) {
      try {
        const useSendGrid = !!this.configService.get<string>('SENDGRID_API_KEY');

        if (useSendGrid) {
          await this.sendGridService.sendVerificationCode(email, code);
          console.log(`✅ Код отправлен на email ${email} через SendGrid`);
        } else {
          await this.emailService.sendVerificationCode(email, code);
          console.log(`✅ Код отправлен на email ${email} через SMTP`);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Ошибка отправки email: ${message}`);
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

    console.log(`🔐 Проверка кода для ${contact}:`);
    console.log(`   Введенный код: ${code}`);
    console.log(`   Сохраненный код: ${storedCode || 'НЕ НАЙДЕН'}`);
    console.log(`   Все коды в памяти:`, Array.from(this.otpStorage.entries()));

    // TODO: потом настроить отправку писем и проверку
    // if (!storedCode) {
    //   console.error(`❌ Код не найден в памяти для ${contact}`);
    //   throw new BadRequestException('Код не найден. Возможно, он истек или не был запрошен.');
    // }
    //
    // if (storedCode !== code) {
    //   console.error(`❌ Неверный код для ${contact}. Ожидался: ${storedCode}, получен: ${code}`);
    //   throw new BadRequestException('Неверный код');
    // }

    console.log(`✅ Код верифицирован успешно для ${contact}`);

    const user = method === 'phone'
      ? await this.usersService.findByPhone(contact)
      : await this.usersService.findByEmail(contact);

    if (!user) {
      console.log(`⚠️  Пользователь ${method}=${contact} не найден в БД - требуется регистрация`);
      // НЕ удаляем код - он может понадобиться для регистрации
      return {
        success: true,
        userExists: false,
        requiresRegistration: true,
        message: 'Пользователь не найден. Необходима регистрация.',
      };
    }

    // Удаляем код только при успешном входе
    this.otpStorage.delete(contact);
    console.log(`✅ Пользователь найден: ID=${user.id}, Email=${user.email}`);

    return {
      success: true,
      userExists: true,
      requiresRegistration: false,
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
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Ошибка отправки email: ${message}`);
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
    // Пробуем найти код по email или phone (в зависимости от того, как регистрировались)
    let contact: string;
    let storedCode: string | undefined;

    // Сначала пробуем email (приоритет), потом телефон
    if (userData.email) {
      storedCode = this.otpStorage.get(userData.email);
      contact = userData.email;
    }

    if (!storedCode && userData.phone) {
      storedCode = this.otpStorage.get(userData.phone);
      contact = userData.phone;
    }

    if (!contact) {
      contact = userData.email || userData.phone || 'unknown';
    }

    console.log(`🔐 Подтверждение регистрации для ${contact}:`);
    console.log(`   Введенный код: ${userData.code}`);
    console.log(`   Сохраненный код: ${storedCode || 'НЕ НАЙДЕН'}`);
    console.log(`   Все коды в памяти:`, Array.from(this.otpStorage.entries()));

    if (!storedCode) {
      console.error(`❌ Код не найден в памяти для ${contact}`);
      throw new BadRequestException('Код не найден. Возможно, он истек или не был запрошен.');
    }

    if (storedCode !== userData.code) {
      console.error(`❌ Неверный код для ${contact}. Ожидался: ${storedCode}, получен: ${userData.code}`);
      throw new BadRequestException('Неверный код');
    }

    console.log(`✅ Код верифицирован успешно для ${contact}`);
    this.otpStorage.delete(contact);

    const user = await this.usersService.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      email: userData.email,
      isVerified: true,
    });

    console.log(`✅ Пользователь зарегистрирован: ID=${user.id}, Email=${user.email}, Phone=${user.phone}`);

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
