import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Body,
  // Delete,
  // HttpStatus,
  // HttpException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from '@nestjs/passport'
import * as fs from 'fs'
import { join } from 'path'

@Controller('upload')
@UseGuards(AuthGuard('jwt'))
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File) {
    return '/static/' + file.filename
  }

  // @Delete()
  // delete(@Body() body) {
  //   if (body.rmFile) {
  //     const path = join(__dirname, '..', body.rmFile)
  //     fs.access(path, (err) => {
  //       if (err) {
  //         return new HttpException('文件不存在', HttpStatus.BAD_REQUEST)
  //       } else {
  //         fs.unlink(path, (err) => {
  //           if (err)
  //             return new HttpException('删除文件失败', HttpStatus.BAD_REQUEST)
  //         })
  //       }
  //     })
  //   } else {
  //     return new HttpException('缺少要删除的文件rmFIle', HttpStatus.BAD_REQUEST)
  //   }
  // }

  @Post('/avatar')
  @UseInterceptors(FileInterceptor('file'))
  createAvatar(@Body() body, @UploadedFile() file: Express.Multer.File) {
    if (body.rmFile) {
      const path = join(__dirname, '..', body.rmFile)
      fs.access(path, (err) => {
        if (!err) fs.unlinkSync(path)
      })
    }
    // TODO 找到body.id对应的用户，将其avatar字段更新为file.filename

    return '/static/' + file.filename
  }
}
