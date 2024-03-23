import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '@/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

export async function swaggerInit(app: NestExpressApplication) {
  // 创建Swagger选项
  const options = new DocumentBuilder()
    .setTitle('Chat-app API')
    .setDescription('即时聊天应用api')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Input your JWT token',
      name: 'Authorization',
      in: 'header',
    },
      'bearer')
    // .addTag('chat-app')
    .build();

  // 创建Swagger文档
  const document = SwaggerModule.createDocument(app, options);

  // 设置`/api`路由为Swagger文档及其UI的主页
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      security: [{ 'bearer': [] }],
    },
  });
}