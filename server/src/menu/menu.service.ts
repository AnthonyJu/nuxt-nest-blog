import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'

import { Menu } from './entities/menu.entity'

@Injectable()
export class MenuService extends TypeOrmCrudService<Menu> {
  constructor(@InjectRepository(Menu) repo) {
    super(repo)
  }
}
