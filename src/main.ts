import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './core/interceptor/transform/transform.interceptor';
import { HttpExceptionFilter } from './core/filter/http-exception/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({
    // whitelist: true,
    transform: true,
    // transformOptions: {
    //   enableImplicitConversion: true
    // }
  }));
  // 全局注册拦截器
  app.useGlobalInterceptors(new TransformInterceptor())
  // 注册全局错误的过滤器
  app.useGlobalFilters(new HttpExceptionFilter())
  await app.listen(process.env.NODE_PORT || 3000);
}
bootstrap();
