import { IsNotEmpty, IsOptional, Length } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @Length(1, 8, { message: '用户名长度必须在1-8之间' })
  username: string

  @IsOptional()
  @Length(5, 10, { message: '密码长度必须在5-10之间' })
  password: string

  @IsOptional()
  avatar: string

  @IsNotEmpty()
  role: string
}
