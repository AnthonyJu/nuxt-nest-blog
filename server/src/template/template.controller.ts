import { Controller, UseGuards } from '@nestjs/common'
import { Crud, CrudController, CrudOptions } from '@nestjsx/crud'
import { AuthGuard } from '@nestjs/passport'
import { TemplateService } from './template.service'
import { Template } from './entities/template.entity'
import { CreateTemplateDto } from './dto/create-template.dto'
import { UpdateTemplateDto } from './dto/update-template.dto'

const crud: CrudOptions = {
  model: {
    type: Template,
  },
  dto: {
    create: CreateTemplateDto,
    update: UpdateTemplateDto,
  },
  query: {
    alwaysPaginate: true,
    sort: [{ field: 'createTime', order: 'DESC' }],
  },
  routes: {
    only: [
      'getOneBase',
      'getManyBase',
      'createOneBase',
      'updateOneBase',
      'deleteOneBase',
    ],
  },
}

@Crud(crud)
@Controller('template')
@UseGuards(AuthGuard('jwt'))
export class TemplateController implements CrudController<Template> {
  constructor(public service: TemplateService) {}

  get base(): CrudController<Template> {
    return this
  }
}
