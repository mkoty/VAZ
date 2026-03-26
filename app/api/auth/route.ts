import { NextResponse } from 'next/server';

// Mock API для демонстрации
export async function POST(request: Request) {
  const body = await request.json();
  const { action, phone, email, code, userData } = body;

  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 500));

  switch (action) {
    case 'requestCode':
      // POST /api/cdp/lecar-id/v1/customer/authentication/phone или email
      // В реальности проверяет наличие пользователя
      // Если найден - отправляет код
      // Если нет - возвращает 404 для перехода на регистрацию
      const userExists = Math.random() > 0.3; // 70% шанс что пользователь существует

      if (userExists) {
        return NextResponse.json({
          success: true,
          message: 'Код отправлен',
          userExists: true
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Пользователь не найден',
          userExists: false
        }, { status: 404 });
      }

    case 'verifyCode':
      // POST /api/cdp/lecar-id/v1/customer/authentication/phone/code или email/code
      // Проверка кода и авторизация
      if (code === '1234') {
        return NextResponse.json({
          success: true,
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: 'user-' + Date.now(),
            name: 'Иван Иванов',
            phone: phone || '',
            email: email || ''
          }
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Неверный код'
        }, { status: 400 });
      }

    case 'register':
      // POST /api/cdp/lecar-id/v1/customer/verification/phone или email
      // Регистрация нового пользователя и отправка кода
      return NextResponse.json({
        success: true,
        message: 'Код подтверждения отправлен'
      });

    case 'confirmRegistration':
      // POST /api/cdp/lecar-id/v1/customer:register
      // Проверка кода и создание пользователя
      if (code === '1234') {
        return NextResponse.json({
          success: true,
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: 'user-' + Date.now(),
            ...userData
          }
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Неверный код'
        }, { status: 400 });
      }

    default:
      return NextResponse.json({
        success: false,
        message: 'Неизвестное действие'
      }, { status: 400 });
  }
}
