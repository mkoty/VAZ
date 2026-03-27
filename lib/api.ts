// Production backend URL (Railway)
const PRODUCTION_API_URL = 'https://vaz-backend-production-8550.up.railway.app';

// Используем production URL по умолчанию, localhost только для явной локальной разработки
const API_URL = process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API_URL;

// Для отладки - показываем какой URL используется
if (typeof window !== 'undefined') {
  console.log('🔗 API URL:', API_URL);
}

export const api = {
  // Auth endpoints
  async requestCode(contact: string, method: 'phone' | 'email') {
    const response = await fetch(`${API_URL}/auth/request-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact, method }),
    });
    return response.json();
  },

  async verifyCode(contact: string, code: string, method: 'phone' | 'email') {
    const response = await fetch(`${API_URL}/auth/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact, code, method }),
    });
    if (!response.ok) {
      throw new Error('Неверный код');
    }
    return response.json();
  },

  async register(userData: {
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
  }) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  async confirmRegistration(userData: {
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
    code: string;
  }) {
    const response = await fetch(`${API_URL}/auth/confirm-registration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Неверный код');
    }
    return response.json();
  },

  // Appeals endpoints
  async createAppeal(appealData: {
    userId: string;
    category: string;
    subject: string;
    message: string;
    phone?: string;
    email?: string;
  }) {
    const response = await fetch(`${API_URL}/appeals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appealData),
    });
    return response.json();
  },

  async getUserAppeals(userId: string) {
    const response = await fetch(`${API_URL}/appeals/user/${userId}`);
    return response.json();
  },
};
