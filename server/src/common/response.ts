import { Injectable, NestInterceptor, CallHandler } from '@nestjs/common'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'

interface Data<T> {
  data: T
}

@Injectable()
export class Response<T = any> implements NestInterceptor {
  intercept(_context, next: CallHandler): Observable<Data<T>> {
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          status: 200,
        }
      }),
    )
  }
}
