import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: null })
  parentId: string | null

  @Column()
  index: number

  @Column({ default: null })
  icon: string | null

  @Column({ unique: true })
  routeName: string

  @Column({ unique: true })
  routePath: string

  @Column('simple-array')
  permission: string[]
}
