import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';

export enum LoginStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  BUSY = 'busy'
}

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  /** 用户名 */
  @Column({ unique: true, length: 255, nullable: false })
  username: string;
  /** 用户密码 */
  @Column({ length: 255, nullable: false, select: false })
  password: string;
  /** 邮箱 */
  @Column({ unique: true, length: 255, nullable: true })
  email: string;
  /** 用户头像 */
  @Column({ length: 255, nullable: true })
  avatar: string;
  /** 用户登录状态 */
  @Column({ type: 'enum', enum: LoginStatus, default: LoginStatus.OFFLINE })
  status: LoginStatus;
  /** 用户最后登录时间 */
  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;
  /** 用户创建时间 */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
  /** 用户更新时间 */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
