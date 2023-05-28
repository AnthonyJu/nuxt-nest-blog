import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'

import { Tag } from './entities/tag.entity'

@Injectable()
export class TagService extends TypeOrmCrudService<Tag> {
  constructor(@InjectRepository(Tag) repo) {
    super(repo)
  }

  // 获取所有标签
  async findAll(): Promise<Tag[]> {
    return await this.repo.find()
  }
}
