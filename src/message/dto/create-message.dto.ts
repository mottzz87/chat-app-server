import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MessageType } from "../entities/message.entity";

export class CreateMessageDto {
  @IsNumber()
  @IsNotEmpty({ message: 'senderId 不能为空' })
  senderId: number;

  @IsNumber()
  @IsNotEmpty({ message: 'receiverId 不能为空' })
  receiverId: number;

  @IsString()
  @IsNotEmpty()
  messageContent: string;

  @IsString()
  @IsNotEmpty()
  messageType?: MessageType;

}
