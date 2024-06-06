import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import * as uniqueContraints from 'src/constants/constraints';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class UniqueConstraintErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        return throwError(() => {
          if (err instanceof QueryFailedError) {
            for (const uc of Object.values(uniqueContraints)) {
              if (err.driverError.constraint === uc.constraint) {
                return new ConflictException(uc.message);
              }
            }
          }
          return err;
        });
      }),
    );
  }
}
