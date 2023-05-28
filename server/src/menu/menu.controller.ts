import { Body, Controller, Query, UseGuards } from '@nestjs/common'
import {
  Crud,
  CrudController,
  CrudOptions,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud'
import { AuthGuard } from '@nestjs/passport'

import { MenuService } from './menu.service'
import { Menu } from './entities/menu.entity'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'

const crud: CrudOptions = {
  model: {
    type: Menu,
  },
  dto: {
    create: CreateMenuDto,
    update: UpdateMenuDto,
  },
  query: {
    alwaysPaginate: true,
    sort: [{ field: 'index', order: 'ASC' }],
  },
  routes: {
    only: ['getManyBase', 'createOneBase', 'updateOneBase', 'deleteOneBase'],
  },
}

@Crud(crud)
@Controller('menu')
@UseGuards(AuthGuard('jwt'))
export class MenuController implements CrudController<Menu> {
  constructor(public service: MenuService) {}

  get base(): CrudController<Menu> {
    return this
  }

  @Override()
  getMany(@ParsedRequest() req: CrudRequest, @Query() query) {
    req.parsed.search = {
      $and: Object.keys(query)
        .filter((key) => !(key in req.parsed))
        .map((key) => {
          if (key === 'permission') {
            return {
              $or: query[key]
                .split(',')
                .map((item) => ({ [key]: { $contL: item } })),
            }
          }
          return { [key]: { $contL: query[key] } }
        }),
    }
    return this.base.getManyBase(req)
  }
}
