import { Body, Controller, Post, Get, Query, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService, UserRo } from './user.service';
import { UserCommonDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) { }

  /**
   * 用户注册
   * @param data
   */
  @Post('create')
  async create(@Body() data: UserCommonDto) {
    return await this.userService.register(data)
  }

  /**
  * 注册
  * @param data
  */
  @Post('register')
  async register(@Body() data: UserCommonDto) {
    await this.userService.register(data)
  }

  /**
   * 获取用户列表
   */
  @UseGuards(AuthGuard)
  @Get('list')
  async findAll(@Query() query, @Req() req: Request | any): Promise<UserRo> {
    console.log(333, req)
    return await this.userService.findAll(query)
  }

  /**
   * 获取用户信息
   * @param id 
   */
  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.userService.findById(id)
  }

  /**
   * 更新用户信息
   * @param id 
   * @param post 
   */
  @Put(":id")
  async updateById(@Param("id") id: number, @Body() post: UpdateUserDto) {
    return await this.userService.updateById(id, post)
  }

  /**
   * 删除用户
   * @param id 
   */
  @Delete(":id")
  async remove(@Param("id") id: number) {
    return await this.userService.remove(id)
  }


}
