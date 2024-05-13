import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCommonDto } from 'src/user/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '@/user/user.service';
import { LoginStatus } from '@/user/entities/user.entity';

@ApiTags('注册登录')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) { }

  /**
   * 注册
   * @param data
   */
  @HttpCode(200)
  @Post('register')
  async register(@Body() data: UserCommonDto) {
    return await this.authService.register(data)
  }

  /**
   * 登录
   * @param data
   */
  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() data: UserCommonDto, @Request() req) {
    const { token } = await this.authService.login(req.user)
    const param = {
      status: LoginStatus.ONLINE,
      last_login: new Date()
    }
    const updatedUser = await this.userService.updateUserLoginStatus(req.user.id, param)
    return { token, ...updatedUser }
  }


  /**
   * 登出
   * @param data
   */
  @HttpCode(200)
  @Post('logout')
  async logout(@Request() req) {
    const param = {
      status: LoginStatus.OFFLINE,
      last_login: new Date()
    }
    return this.userService.updateUserLoginStatus(req.user.id, param)
  }



}
