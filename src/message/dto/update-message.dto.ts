import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-message.dto';
import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  @ApiProperty()
  @IsBoolean()
  isRead?: boolean;

  @ApiProperty()
  @IsBoolean()
  isDeletedBySender?: boolean;

  @ApiProperty()
  @IsBoolean()
  isRecall?: boolean
}
