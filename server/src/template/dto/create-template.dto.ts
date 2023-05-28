import { IsNotEmpty } from 'class-validator'

export class CreateTemplateDto {
  @IsNotEmpty()
  filed: string
}
