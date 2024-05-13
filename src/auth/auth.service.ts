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
  // //token 黑名单（退出登录）
  // private blackTokenList: string[] = []
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

  async login(data: UserCommonDto): Promise<any> {
    const token = await this.certificate(data)
    return {
      ...data,
      token,
    }
  }

  logout(data) {
    // // 将 Token 添加到黑名单中
    // this.blackTokenList.push(data.token);
    return {
      code: 200,
      message: '退出登录成功'
    }
  }

  // // 验证 Token 是否在黑名单中
  // isTokenBlacklisted(token: string): boolean {
  //   console.log(this.blackTokenList)
  //   return this.blackTokenList.includes(token);
  // }

}
