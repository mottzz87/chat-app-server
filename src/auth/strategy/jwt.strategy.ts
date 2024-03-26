import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, StrategyOptions, } from 'passport-jwt';
import { Strategy } from 'passport-local';
import { JWT_CONFIG } from 'src/const';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONFIG.secret,
    } as StrategyOptions);
  }

  async validate(payload: any) {
    const existUser = await this.userRepository.findOne({
      where: { id: payload.id },
    });
    if (!existUser) throw new UnauthorizedException('token验证失败')
    return existUser;
  }
}

