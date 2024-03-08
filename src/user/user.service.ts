import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UserCommonDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

export interface UserRo {
  list: CreateUserDto[];
  count: number;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }
  // 用户注册
  async register(data: Partial<CreateUserDto>): Promise<CreateUserDto> {
    const { username } = data;
    const hasUser = await this.userRepository.findOne({ where: { username } });
    if (hasUser) {
      throw new HttpException('用户已存在', 401);
    }
    return await this.userRepository.save(data);
  }

  async login(data: Partial<UserCommonDto>): Promise<UserCommonDto> {
    const { username, password } = data
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new HttpException('用户名不存在', 201)
    }
    if (user.password !== password) {
      throw new HttpException('用户名或密码错误', 201)
    }

    return user
  }

  // 获取用户列表
  async findAll(query): Promise<UserRo> {
    const qb = await this.userRepository.createQueryBuilder('user');
    qb.where('1 = 1');
    qb.orderBy('user.created_at', 'DESC');

    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10, ...params } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const posts = await qb.getMany();
    return { list: posts, count: count };
  }
  // 获取用户信息
  async findById(id): Promise<CreateUserDto> {
    return await this.userRepository.findOne({ where: { id } });
  }

  // 获取用户信息
  async findByName(username): Promise<CreateUserDto> {
    return await this.userRepository.findOne({ where: { username } });
  }
  // 更新用户信息
  async updateById(id, post): Promise<CreateUserDto> {
    const { username, password } = post
    const exist = await this.userRepository.findOne({ where: { id } });
    if (!exist) {
      throw new HttpException(`id为${id}的用户不存在`, 401);
    }
    if (!username || !password) {
      throw new HttpException('缺少用户名或密码', 401);
    }
    const updateUser = this.userRepository.merge(exist, post);
    return this.userRepository.save(updateUser);
  }
  // 刪除用户
  async remove(id) {
    const exist = await this.userRepository.findOne({ where: { id } });
    if (!exist) {
      throw new HttpException(`id为${id}的用户不存在`, 401);
    }
    return await this.userRepository.remove(exist);
  }
}
