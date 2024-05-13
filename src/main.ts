import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './core/interceptor/transform/transform.interceptor';
import { HttpExceptionFilter } from './core/filter/http-exception/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';
import { VERSION } from './const/server';
import { swaggerInit } from './utils/swagger';
import * as cors from 'cors';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors()
  // app.useWebSocketAdapter(new IoAdapter()); // 设置 WebSocket 适配器为 Socket.IO
  app.setGlobalPrefix(`${VERSION}`)
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  // 全局守卫
  const authService = app.get(AuthService);
  app.useGlobalGuards(new AuthGuard(authService));
  // 全局注册拦截器
  app.useGlobalInterceptors(new TransformInterceptor())
  // 注册全局错误的过滤器
  app.useGlobalFilters(new HttpExceptionFilter())
  // swagger在线文档
  await swaggerInit(app)
  await app.listen(process.env.NODE_PORT || 3000);
}
bootstrap();
