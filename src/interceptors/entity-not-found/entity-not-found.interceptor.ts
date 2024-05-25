import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { EntityNotFoundError } from 'typeorm';

@Injectable()
export class EntityNotFoundInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        return throwError(() =>
          err instanceof EntityNotFoundError ? new NotFoundException() : err,
        );
      }),
    );
  }
}
