import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { WebsocketGateway } from './websocket.gateway';
import { MessageModule } from '@/message/message.module';

@Module({
  imports: [
    MessageModule
  ],
  providers: [WebsocketGateway, WebsocketService]
})
export class WebsocketModule { }
