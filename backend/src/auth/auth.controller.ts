import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('request-code')
  async requestCode(@Body() body: { contact: string; method: 'phone' | 'email' }) {
    return this.authService.requestCode(body.contact, body.method);
  }

  @Post('verify-code')
  async verifyCode(@Body() body: { contact: string; code: string; method: 'phone' | 'email' }) {
    return this.authService.verifyCode(body.contact, body.code, body.method);
  }

  @Post('register')
  async register(@Body() body: { firstName: string; lastName: string; phone?: string; email?: string }) {
    return this.authService.register(body);
  }

  @Post('confirm-registration')
  async confirmRegistration(@Body() body: { firstName: string; lastName: string; phone?: string; email?: string; code: string }) {
    return this.authService.confirmRegistration(body);
  }
}
