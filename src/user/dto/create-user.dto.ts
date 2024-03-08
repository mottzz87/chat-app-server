import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class UserCommonDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}

export class CreateUserDto extends UserCommonDto {
  id?: number;

  @IsString()
  email?: string;

  @IsString()
  avatar?: string;

}
