import { MessageEntity } from '@/message/entities/message.entity';
import { UpdateUserDto } from "@/user/dto/update-user.dto";


export interface ChatUser {
  user: UpdateUserDto;
  latestMessage: MessageEntity;
}