import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { WebsocketService } from './websocket.service';
import { CreateWebsocketDto } from './dto/create-websocket.dto';
import { UpdateWebsocketDto } from './dto/update-websocket.dto';
import { Server, Socket } from 'socket.io';
import { MessageService } from '@/message/message.service';
import { CreateMessageDto } from '@/message/dto/create-message.dto';
import { ApiProperty } from '@nestjs/swagger';

@WebSocketGateway()
export class WebsocketGateway {
  constructor(
    private readonly websocketService: WebsocketService,
    private readonly messageService: MessageService
  ) { }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('msgToServer')
  async handleMessage(client: any, payload: CreateMessageDto) {
    await this.messageService.create(payload)
    this.server.emit('msgToClient', payload);
    // this.server.to(String(payload.receiverId)).emit('msgToClient', payload);
  }

  afterInit(server: Server) {
    console.log('Initialized!');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client disconnected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('createWebsocket')
  create(@MessageBody() createWebsocketDto: CreateWebsocketDto) {
    return this.websocketService.create(createWebsocketDto);
  }

  @SubscribeMessage('findAllWebsocket')
  findAll() {
    return this.websocketService.findAll();
  }

  @SubscribeMessage('findOneWebsocket')
  findOne(@MessageBody() id: number) {
    return this.websocketService.findOne(id);
  }

  @SubscribeMessage('updateWebsocket')
  update(@MessageBody() updateWebsocketDto: UpdateWebsocketDto) {
    return this.websocketService.update(updateWebsocketDto.id, updateWebsocketDto);
  }

  @SubscribeMessage('removeWebsocket')
  remove(@MessageBody() id: number) {
    return this.websocketService.remove(id);
  }
}
