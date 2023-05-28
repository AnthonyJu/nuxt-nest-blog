import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  username: string

  @Column({ select: false, default: '123456' })
  password: string

  @Column({ default: '' })
  avatar: string

  @Column()
  role: string

  @CreateDateColumn({ type: 'timestamp' })
  createTime: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updateTime: Date
}
