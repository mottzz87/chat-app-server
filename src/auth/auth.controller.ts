import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCommonDto } from 'src/user/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('注册登录')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  /**
   * 登录
   * @param data
   */
  @HttpCode(200)
  @Post('login')
  async login(@Body() data: UserCommonDto) {
    return await this.authService.login(data)
  }

  /**
   * 注册
   * @param data
   */
  @HttpCode(200)
  @Post('register')
  async register(@Body() data: UserCommonDto) {
    return await this.authService.register(data)
  }

}
