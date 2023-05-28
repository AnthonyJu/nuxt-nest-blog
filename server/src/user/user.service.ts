import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Equal, Like, In } from 'typeorm'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.user.findOneBy({
      username: Equal(createUserDto.username),
    })
    if (user) throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST)

    const data = this.user.create(createUserDto)
    return this.user.save(data)
  }

  async findAll(query) {
    const { page = 1, limit = 0, ...entries }: Record<string, any> = query
    const data = await this.user.findAndCount({
      where: Object.fromEntries(
        Object.entries(entries).map(([key, value]) => {
          if (key === 'role' && value) return [key, In(value.split(','))]
          return [key, Like(`%${value}%`)]
        }),
      ),
      skip: (page - 1) * limit,
    })
    return {
      data: data[0],
      total: data[1],
    }
  }

  async findOne(id: number) {
    const user = await this.user.findOneBy({ id })
    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { newPassword, oldPassword, ...data } = updateUserDto
    const user = await this.user.findOne({
      where: {
        id: Equal(id),
      },
      select: ['password'],
    })
    if (oldPassword) {
      if (user.password === oldPassword) {
        return this.user.update(id, { ...data, password: newPassword })
      } else {
        throw new HttpException('原密码错误', HttpStatus.BAD_REQUEST)
      }
    } else {
      return this.user.update(id, { ...data })
    }
  }

  remove(id: number) {
    return this.user.delete(id)
  }

  async findUser(username: string): Promise<User | undefined> {
    const user = await this.user.findOne({
      where: {
        username: Equal(username),
      },
      select: ['id', 'username', 'password', 'role', 'avatar'],
    })
    return user
  }
}
