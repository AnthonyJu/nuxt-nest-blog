import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UserService } from '../user/user.service'
import { CreateUserDto } from '../user/dto/create-user.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findUser(username)
    if (user && user.password === password) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(createUserDto: CreateUserDto) {
    const user = await this.usersService.findUser(createUserDto.username)
    if (user && user.password === createUserDto.password) {
      const { password, ...result } = user
      return {
        ...result,
        access_token: this.jwtService.sign(result),
      }
    }
    throw new HttpException('用户名或密码错误', HttpStatus.BAD_REQUEST)
  }
}
