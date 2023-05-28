import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppService } from './app.service'
import { AppController } from './app.controller'

import { AuthModule } from './auth/auth.module'
import { MenuModule } from './menu/menu.module'
import { UserModule } from './user/user.module'
import { UploadModule } from './upload/upload.module'
import { RoleModule } from './role/role.module'
import { ArticleModule } from './article/article.module'
import { JwtMiddleware } from './middleware/jwt.middleware'
import { TagModule } from './tag/tag.module'
import { TemplateModule } from './template/template.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      username: 'root',
      password: '119911peng',
      host: 'localhost',
      port: 3306,
      database: 'awesome_app',
      synchronize: true,
      retryDelay: 1000,
      retryAttempts: 3,
      autoLoadEntities: true,
    }),
    UploadModule,
    AuthModule,
    UserModule,
    MenuModule,
    RoleModule,
    ArticleModule,
    TagModule,
    TemplateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes({ path: 'article', method: RequestMethod.POST })
  }
}
