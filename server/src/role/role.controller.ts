import { Controller, Query, UseGuards } from '@nestjs/common'
import {
  Crud,
  CrudController,
  CrudOptions,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud'
import { AuthGuard } from '@nestjs/passport'

import { RoleService } from './role.service'
import { Role } from './entities/role.entity'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'

const crud: CrudOptions = {
  model: {
    type: Role,
  },
  dto: {
    create: CreateRoleDto,
    update: UpdateRoleDto,
  },
  query: {
    alwaysPaginate: true,
  },
  routes: {
    only: ['getManyBase', 'createOneBase', 'updateOneBase', 'deleteOneBase'],
  },
}

@Crud(crud)
@Controller('role')
@UseGuards(AuthGuard('jwt'))
export class RoleController implements CrudController<Role> {
  constructor(public service: RoleService) {}

  get base(): CrudController<Role> {
    return this
  }

  @Override()
  getMany(@ParsedRequest() req: CrudRequest, @Query() query) {
    req.parsed.search = {
      $and: Object.keys(query)
        .filter((key) => !(key in req.parsed))
        .map((key) => ({ [key]: { $contL: query[key] } })),
    }
    return this.base.getManyBase(req)
  }
}
