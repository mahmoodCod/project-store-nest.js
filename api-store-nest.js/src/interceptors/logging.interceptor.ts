import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    // befor
    const now = Date.now();

    // after
    return next
      .handle()
      .pipe(tap(() => console.log(`Request took ${Date.now() - now}ms`)));
  }
}
