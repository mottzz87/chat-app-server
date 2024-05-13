import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class UserCommonDto {
  @ApiProperty()
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}

export class CreateUserDto extends UserCommonDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  @IsString()
  nickname?: string;

  @ApiProperty()
  @IsString()
  email?: string;

  @ApiProperty()
  @IsString()
  avatar?: string;

}
