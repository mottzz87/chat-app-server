import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from './auth.service';
import { UserCommonDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  /**
   * 登录
   * @param data
   */
  @Post('login')
  async login(@Body() data: UserCommonDto) {
    await this.authService.login(data)
  }

  /**
   * 注册
   * @param data
   */
  @Post('register')
  async register(@Body() data: UserCommonDto) {
    await this.authService.register(data)
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

}
