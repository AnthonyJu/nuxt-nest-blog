import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { Crud, CrudController, CrudOptions } from '@nestjsx/crud'
import { AuthGuard } from '@nestjs/passport'
import { TagService } from './tag.service'
import { Tag } from './entities/tag.entity'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'

const crud: CrudOptions = {
  model: {
    type: Tag,
  },
  dto: {
    create: CreateTagDto,
    update: UpdateTagDto,
  },
  query: {
    alwaysPaginate: true,
    sort: [{ field: 'createTime', order: 'DESC' }],
  },
  routes: {
    only: ['getManyBase', 'createOneBase', 'updateOneBase', 'deleteOneBase'],
  },
}

@Crud(crud)
@Controller('tag')
@UseGuards(AuthGuard('jwt'))
export class TagController implements CrudController<Tag> {
  constructor(public service: TagService) {}

  get base(): CrudController<Tag> {
    return this
  }

  // 获取所有标签
  @Get('all')
  async findAll(): Promise<Tag[]> {
    return await this.service.findAll()
  }
}
