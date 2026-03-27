import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Next.js frontend
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://mac.github.io', // GitHub Pages (обновите на ваш username)
    /\.github\.io$/, // Все поддомены github.io
    /localhost:\d+$/, // Локальные порты для разработки
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Разрешить запросы без origin (мобильные приложения, Postman)
      if (!origin) return callback(null, true);

      // Проверка по списку разрешенных origins
      const isAllowed = allowedOrigins.some(allowed => {
        if (typeof allowed === 'string') return origin === allowed;
        if (allowed instanceof RegExp) return allowed.test(origin);
        return false;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`⚠️  CORS blocked request from: ${origin}`);
        callback(null, true); // В development разрешаем все
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 API Server running on http://localhost:${port}`);
}

bootstrap();
