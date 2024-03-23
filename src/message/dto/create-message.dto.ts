import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MessageType } from "../entities/message.entity";
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'senderId 不能为空' })
  senderId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'receiverId 不能为空' })
  receiverId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  messageContent: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  messageType?: MessageType;

}
