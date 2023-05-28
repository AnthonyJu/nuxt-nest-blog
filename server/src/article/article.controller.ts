import { Controller, Request, Body, UseGuards, Query } from '@nestjs/common'
import {
  Crud,
  CrudController,
  CrudOptions,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud'
import { AuthGuard } from '@nestjs/passport'
import { ArticleService } from './article.service'
import { Article } from './entities/article.entity'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'

const crud: CrudOptions = {
  model: {
    type: Article,
  },
  dto: {
    create: CreateArticleDto,
    update: UpdateArticleDto,
  },
  query: {
    exclude: ['content'],
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
@Controller('article')
export class ArticleController implements CrudController<Article> {
  constructor(public service: ArticleService) {}

  get base(): CrudController<Article> {
    return this
  }

  @Override()
  getOne(@ParsedRequest() parsedReq: CrudRequest) {
    parsedReq.options.query.exclude = []
    return this.base.getOneBase(parsedReq)
  }

  @Override()
  @UseGuards(AuthGuard('jwt'))
  createOne(@Request() req, @ParsedRequest() parsedReq: CrudRequest) {
    req.body.authorId = req.user.userId
    req.body.authorName = req.user.username
    return this.base.createOneBase(parsedReq, req.body)
  }

  @Override()
  @UseGuards(AuthGuard('jwt'))
  updateOne(@ParsedRequest() req: CrudRequest, @Body() dto) {
    return this.base.updateOneBase(req, dto)
  }

  @Override()
  @UseGuards(AuthGuard('jwt'))
  deleteOne(@ParsedRequest() req: CrudRequest) {
    return this.base.deleteOneBase(req)
  }
}
