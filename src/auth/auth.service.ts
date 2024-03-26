import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateUserDto, UserCommonDto } from 'src/user/dto/create-user.dto';
import { Repository } from 'typeorm';
import { JWT_CONFIG } from 'src/const';
import { BcryptService } from '@/utils/bcrypt';

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
      ...JWT_CONFIG
    })
    return token
  }


  async login(data: UserCommonDto): Promise<any> {
    const token = await this.certificate(data)
    return {
      ...data,
      token,
    }
  }

  async register(data: Partial<UserCommonDto>): Promise<UserCommonDto> {
    const { username, password } = data;
    const hasUser = await this.userRepository.findOne({ where: { username } });
    if (hasUser) {
      throw new HttpException('用户已存在', 401);
    }
    return await this.userRepository.save({
      ...data,
      password: await BcryptService.hash(password)
    });
  }
}
