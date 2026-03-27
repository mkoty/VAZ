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

    console.log(`🔍 Поиск пользователя ${method}=${contact}: ${user ? 'найден ✅' : 'не найден ❌'}`);
    if (user) {
      console.log(`👤 Пользователь: ID=${user.id}, Email=${user.email}, Phone=${user.phone}`);
    }

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

    if (!storedCode) {
      console.error(`❌ Код не найден в памяти для ${contact}`);
      throw new BadRequestException('Код не найден. Возможно, он истек или не был запрошен.');
    }

    if (storedCode !== code) {
      console.error(`❌ Неверный код для ${contact}. Ожидался: ${storedCode}, получен: ${code}`);
      throw new BadRequestException('Неверный код');
    }

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
    const contact = userData.phone || userData.email;
    const storedCode = this.otpStorage.get(contact);

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
