import { Controller, Get, Post, Body, Patch, Param, Delete, Redirect, Request } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('消息类接口')
@ApiBearerAuth()
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @Post('send')
  send(@Body() newMessage: CreateMessageDto) {
    return this.messageService.create(newMessage);
  }

  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.messageService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }

  // 获取消息列表
  @Get('getMessageUserList')
  getMessageUserList(@Request() req) {
    return this.messageService.getMessageUserList(req.user)
  }

  // 单人聊天
  @Get('getChatHistory/:userId')
  async getChatHistory(@Request() req): Promise<any> {
    const userId = req.user.sub; // 从 JWT 载荷中获取用户 ID
    const targetUserId = req.params.userId;
    return this.messageService.getChatHistory(userId, targetUserId);
  }

  // 群组聊天
}
