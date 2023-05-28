import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @CreateDateColumn({ type: 'timestamp' })
  createTime: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updateTime: Date
}
