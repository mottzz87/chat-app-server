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

  private clients: Map<string, Socket> = new Map();

  @SubscribeMessage('msgToServer')
  async handleMessage(client: any, payload: CreateMessageDto) {
    await this.messageService.create(payload)
    // this.server.emit('msgToClient', payload);
    // console.log(this.server.sockets)
    // this.server.in(String(payload.receiverId)).emit('msgToClient', payload);

    const { receiverId, content } = payload;
    if (receiverId && this.clients.has(client.id)) {
      const recipientSocket = this.clients.get(client.id);
      recipientSocket.emit('msgToClient', payload);
    } else {
      console.log(`Recipient ${receiverId} not found`);
    }
  }
  @SubscribeMessage('subscribeAll')
  async handleMessageList(client: any, payload: CreateMessageDto) {
    // this.server.emit('loadUsersMessageToClient', payload);
    return this.websocketService.findAll()
  }

  afterInit(server: Server) {
    console.log('Initialized!');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    this.clients.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client.id);
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
