import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JWT_CONFIG } from 'src/const';
import { VERSION } from 'src/const/server';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    // 鉴权
    if (this.whiteUrlList.includes(request.url.split('?')[0])) {
      return true
    }
    if (!token) {
      throw new UnauthorizedException();
    }

    // if (this.authService.isTokenBlacklisted(token)) {
    //   throw new UnauthorizedException();
    // }
    try {
      const payload = await new JwtService().verifyAsync(
        token,
        {
          secret: JWT_CONFIG.secret
        }
      );
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return request;
  }

  // 白名单权限
  private whiteUrlList: string[] = [
    `/${VERSION}/auth/login`,
    `/${VERSION}/auth/register`
  ]

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}