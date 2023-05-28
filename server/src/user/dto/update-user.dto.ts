import { Length, IsOptional } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @Length(5, 10, { message: '密码长度必须在5-10之间' })
  oldPassword: string

  @IsOptional()
  @Length(5, 10, { message: '密码长度必须在5-10之间' })
  newPassword: string
}
