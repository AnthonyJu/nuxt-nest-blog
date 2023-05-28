import { IsNotEmpty } from 'class-validator'

export class CreateMenuDto {
  id: number

  parentId: string | null

  @IsNotEmpty()
  index: number

  @IsNotEmpty()
  icon: string

  @IsNotEmpty()
  routeName: string

  @IsNotEmpty()
  routePath: string

  @IsNotEmpty()
  permission: string[]
}
