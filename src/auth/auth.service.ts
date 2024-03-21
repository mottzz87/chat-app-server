import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateUserDto, UserCommonDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { JWT_KEY } from 'src/const';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) { }
  async certificate(user: CreateUserDto) {
    const payload = {
      sub: user.id,
      username: user.username,
    }
    const token = await this.jwtService.signAsync(payload, {
      ...JWT_KEY
    })
    return token
  }


  async login(data: Partial<UserCommonDto>): Promise<any> {
    const { username, password } = data
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new HttpException('用户名不存在', 201)
    }
    if (user.password !== password) {
      throw new HttpException('用户名或密码错误', 201)
    }
    const access_token = await this.certificate(user)
    console.log('access_token', access_token);
    return {
      user,
      access_token,
      code: 3,
    }
  }

  async register(data: Partial<UserCommonDto>): Promise<UserCommonDto> {
    const { username } = data;
    const hasUser = await this.userRepository.findOne({ where: { username } });
    if (hasUser) {
      throw new HttpException('用户已存在', 401);
    }
    const user = await this.userRepository.save(data)
    return user;
  }
}
