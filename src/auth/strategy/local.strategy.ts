import { UserCommonDto } from '@/user/dto/create-user.dto';
import { BcryptService } from '@/utils/bcrypt';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { IStrategyOptions, Strategy } from 'passport-local'
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
  ) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions)
  }

  async validate(username: string, password: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username=:username', { username })
      .getOne()
    if (!user) {
      throw new BadRequestException('用户名不存在')
    }
    const isSamePwd = await BcryptService.compare(password, user.password)
    if (!isSamePwd) {
      throw new BadRequestException('用户名或密码错误')
    }
    return user;
  }
}

