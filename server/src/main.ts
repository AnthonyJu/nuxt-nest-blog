import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common'
import { join } from 'path'

import { AppModule } from './app.module'
import { Response } from './common/response'
import { HttpFilter } from './common/filter'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useStaticAssets(join(__dirname, 'static'), { prefix: '/static' })
  app.useGlobalInterceptors(new Response())
  app.useGlobalFilters(new HttpFilter())
  app.useGlobalPipes(new ValidationPipe())
  app.setGlobalPrefix('/blog')
  await app.listen(3000)
}
bootstrap()

// TODO 接口权限
