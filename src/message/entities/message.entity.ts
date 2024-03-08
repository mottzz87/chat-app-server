import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

export enum MessageType {
  /** 文字消息 */
  TEXT = 'text',
  /** 表情消息 */
  EMOJI = 'emoji',
  /** 图片消息 */
  IMAGE = 'image',
  /** 文件消息 */
  FILE = 'file',
  /** 视频消息 */
  Video = 'video',
  /** 语音消息 */
  AUDIO = 'audio',
  /** 撤回消息 */
  RECALL = 'recall',
  /** @提及消息 */
  MENTION = 'mention',
  /** 位置消息 */
  Location = 'location'
}

// 定义Message实体类
@Entity('message')
export class MessageEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderId: number;

  @Column()
  receiverId: number;

  @Column()
  messageContent: string;

  @Column({ type: 'enum', enum: MessageType, default: MessageType.TEXT })
  messageType: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  sentAt: Date;

  @Column({ default: false })
  isRead: boolean;

  @Column({ default: false })
  isDeletedBySender: boolean;

  @Column({ default: false })
  isDeletedByReceiver: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
