import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { Repository } from 'typeorm';
import { UserService } from '@/user/user.service';
import { ChatUser } from './message.model';
import { CreateUserDto, UserCommonDto } from '@/user/dto/create-user.dto';
import { UpdateUserDto } from '@/user/dto/update-user.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private readonly userService: UserService,
  ) { }
  create(newMessage: CreateMessageDto) {
    console.log(newMessage)
    return this.messageRepository.save(newMessage);
  }

  findAll() {
    return `This action returns all message`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} message`;
  // }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }

  // 用户的聊天列表
  async getMessageUserList(data): Promise<any> {
    const { id } = data
    const users: UpdateUserDto[] = (await this.userService.findAll()).list

    const chatUsers: ChatUser[] = [];
    for (const user of users) {
      const latestMessage = await this.messageRepository
        .createQueryBuilder('message')
        .where('message.senderId = :userId OR message.receiverId = :userId', { userId: user.id })
        .orderBy('message.createdAt', 'DESC')
        .getOne();

      if (latestMessage) {
        chatUsers.push({ user, latestMessage, ...user });
      }
    }
    return chatUsers
  }

  async getChatHistory(userId: number, targetUserId: number, page: number = 1, limit: number = 10): Promise<MessageEntity[]> {
    const skip = (page - 1) * limit; // 计算要跳过的记录数
    return await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .where('(message.senderId = :userId AND message.receiverId = :targetUserId) OR (message.senderId = :targetUserId AND message.receiverId = :userId)', { userId, targetUserId })
      .orderBy('message.createdAt', 'ASC')
      .getMany();
  }
}
