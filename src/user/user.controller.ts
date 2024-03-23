import { Body, Controller, Post, Get, Query, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService, UserRo } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('用户类接口')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  /**
   * 获取用户列表
   */
  @Get('list')
  async findAll(@Query() query, @Req() req: Request | any): Promise<UserRo> {
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
