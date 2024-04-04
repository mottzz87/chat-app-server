import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UserCommonDto } from './dto/create-user.dto';
import { LoginStatus, UserEntity } from './entities/user.entity';
import { PaginationService } from '@/utils/pagination';

export interface UserRo {
  list: CreateUserDto[];
  pageNo: number;
  pageSize: number;
  total: number;
  totalPages?: number;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  // 获取用户列表
  async findAll(query): Promise<UserRo> {
    const qb = await this.userRepository.createQueryBuilder('user');
    qb.where('1 = 1');
    qb.orderBy('user.created_at', 'DESC');

    const total = await qb.getCount();
    const { pageNo = 1, pageSize = 10, ...params } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNo - 1));

    const list = await qb.getMany();
    return { list, total, pageNo, pageSize, };
  }
  // 获取用户信息
  async findById(id): Promise<CreateUserDto> {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new HttpException('该用户不存在', 201)
    }
    return user;
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

  async updateUserLoginStatus(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('用户名不存在');
    }

    user.status = LoginStatus.ONLINE;
    user.last_login = new Date();

    return this.userRepository.save(user);
  }
}
