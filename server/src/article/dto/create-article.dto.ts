import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateArticleDto {
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  content: string

  @IsOptional()
  tags: string

  @IsNotEmpty()
  poster: string
}
