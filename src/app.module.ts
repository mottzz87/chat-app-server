import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import envConfig from '../config/env';
import { MessageModule } from './message/message.module';
import { UserEntity } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';

import { WebsocketModule } from './websocket/websocket.module';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // 设置为全局
      envFilePath: [envConfig.path]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql', // 数据库类型
        // entities: [UserEntity],  // 数据表实体
        host: configService.get('DB_HOST', 'localhost'), // 主机，默认为localhost
        port: configService.get<number>('DB_PORT', 3306), // 端口号
        username: configService.get('DB_USER', 'root'),   // 用户名
        password: configService.get('DB_PASSWD', '12345678'), // 密码
        database: configService.get('DB_DATABASE', 'chatapp'), //数据库名
        timezone: '+08:00', //服务器上配置的时区
        synchronize: !envConfig.isProd, //根据实体自动创建数据库表， 生产环境建议关闭
        autoLoadEntities: true,
      }),
      // dataSourceFactory: async (options) => {
      //   const dataSource = await new DataSource(options).initialize();
      //   return dataSource;
      // },
    }),
    AuthModule,
    UserModule,
    MessageModule,
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule { }
